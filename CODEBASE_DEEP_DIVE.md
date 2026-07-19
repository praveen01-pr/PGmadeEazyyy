# 📖 PG Made Eazy - Codebase & File-by-File Deep Dive

Welcome to the official developer guide for the **PG Made Eazy** codebase. This guide explains how the system runs, how data flows to the database, and provides a line-by-line look at the most critical configuration and code files.

---

## 🔄 1. System Lifecycles

### A. How It Runs (Process Lifecycle)
* **Frontend client**: Served by Vite locally on port **`5173`**. Vite compiles JSX and CSS on-demand using modern ES Modules.
* **Backend server**: Served by Tomcat (embedded in Spring Boot) locally on port **`8080`**. It loads security filters, routes requests, and maintains connection pools with MongoDB Atlas.

### B. How It Stores Data (Write Lifecycle)
* **Example - Seeker Sign Up**:
  1. The user fills in registration fields. React captures input in local state.
  2. Axios posts a JSON body containing user values to `/api/auth/register/seeker`.
  3. `RegistrationController` maps JSON into a Java `Seeker` object.
  4. `RegistrationService` hashes the password using `BCryptPasswordEncoder` and calls `seekerRepository.save(seeker)`.
  5. The database client writes a new document containing the password hash to MongoDB Atlas's cloud collections.

### C. How It Outputs Data (Query & Render Lifecycle)
* **Example - Searching Hostels**:
  1. User clicks search. React routes the browser to `/find-pg` and sends an HTTP GET request to `/api/properties/approved`.
  2. `PropertyController` queries `propertyRepository.findByStatus("APPROVED")`.
  3. MongoDB Atlas returns the active hostels.
  4. Spring Boot converts the list of database items into a JSON array string.
  5. Frontend receives JSON array, updates the React state (`setProperties(data)`), and the screen dynamically draws the hostel cards.

---

## 📂 2. File-by-File Technical Deep Dive

### 🛡️ File 1: `WebSecurityConfig.java` (Backend Security)
*Path: `backend/src/main/java/com/pgmadeeazy/security/WebSecurityConfig.java`*
```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig implements WebMvcConfigurer {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers("/api/auth/**").permitAll() // Public auth routes
                    .requestMatchers("/api/properties/**").permitAll() // Public listings
                    .anyRequest().authenticated(); // Private endpoints (Booking/Dashboards)
            })
            .sessionManagement(session -> {
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS); // JWT-based
            });
```
* **`csrf().disable()`**: Disables token verification templates for requests. Safe since we use bearer tokens instead of sessions.
* **`permitAll()`**: Specifies that login, sign-up, and PG listing requests do not require session validation headers.
* **`STATELESS`**: Tells Spring Boot never to store sessions on the database or disk. Requests are verified purely via user-transmitted headers.

---

### 🔑 File 2: `JwtRequestFilter.java` (Request Interceptor)
*Path: `backend/src/main/java/com/pgmadeeazy/security/JwtRequestFilter.java`*
```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Extract token string
            username = jwtUtil.extractUsername(jwt); // Retrieve email
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication); // Log in
            }
        }
        chain.doFilter(request, response);
    }
}
```
* **`OncePerRequestFilter`**: Guarantees the filter intercepts exactly once per API transaction.
* **`Bearer ` Check**: Extracts the raw cryptographic JWT string from the header.
* **`SecurityContextHolder`**: Automatically registers the verified user credentials for authorization context downstream.

---

### 🛠️ File 3: `JWTUtil.java` (Cryptographic Helper)
*Path: `backend/src/main/java/com/pgmadeeazy/security/JWTUtil.java`*
```java
@Service
public class JWTUtil {
    private String SECRET_KEY = "pgmadeeazy_super_secret_key_which_should_be_long_and_secure";

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject) // Sets user's email
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 Hours Expiry
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // HS256 crypt signature
            .compact();
    }
}
```
* **`SECRET_KEY`**: Private password signature. Prevents token tampering.
* **`HS256 Signature`**: Attaches a signature to the token. If a browser alters the user ID or email, the signature validation fails on the server.

---

### ✉️ File 4: `EmailService.java` (Non-Blocking Emailer)
*Path: `backend/src/main/java/com/pgmadeeazy/service/EmailService.java`*
```java
    public void sendRegistrationEmail(String to, String name, String userType) {
        new Thread(() -> {
            try {
                Context context = new Context();
                context.setVariable("name", name);
                context.setVariable("userType", userType);

                String emailContent = templateEngine.process("registration-email", context);

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(to);
                helper.setSubject("Welcome to PG Made Easy!");
                helper.setText(emailContent, true);

                mailSender.send(message);
            } catch (Exception e) {
                logger.error("Failed to send email to: {}", to, e);
            }
        }).start(); // Trigger async thread
    }
```
* **`new Thread().start()`**: Spawns a parallel CPU thread. Prevents SMTP connection delays (which can take up to 60 seconds on cloud services) from locking the sign-up request.
* **`templateEngine`**: Integrates with Thymeleaf to produce dynamic HTML templates.

---

### 💳 File 5: `PayPalService.java` (Payment Engine)
*Path: `backend/src/main/java/com/pgmadeeazy/service/PayPalService.java`*
```java
    public Map<String, String> createPayment(String bookingId, Double total, String currency, ...) {
        String accessToken = getAccessToken(); // Fetches OAuth2 token
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("intent", "sale");
        requestBody.put("payer", Map.of("payment_method", "paypal"));
        requestBody.put("transactions", List.of(Map.of(
            "amount", Map.of("total", String.format("%.2f", total), "currency", currency)
        )));
        ...
        ResponseEntity<Map> response = restTemplate.postForEntity(
            paypalBaseUrl + "/v1/payments/payment", request, Map.class);
```
* **`getAccessToken()`**: Uses your PayPal Sandbox Developer keys to fetch a temporary OAuth2 token.
* **`createPayment(...)`**: Sends a request to PayPal containing booking price and callbacks. Returns the `approvalUrl` back to the client.

---

### 🚪 File 6: `AuthController.java` (Login Routing Controller)
*Path: `backend/src/main/java/com/pgmadeeazy/controller/AuthController.java`*
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    ...
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Seeker seeker = seekerRepository.findByEmail(loginRequest.getEmail());
        Provider provider = providerRepository.findByEmail(loginRequest.getEmail());

        if (seeker != null) {
            if (passwordEncoder.matches(loginRequest.getPassword(), seeker.getPassword())) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(seeker.getEmail());
                String token = jwtUtil.generateToken(userDetails);
                return ResponseEntity.ok(new LoginResponse(token, "seeker", seeker.getId(), ...));
            }
        }
```
* **`@RestController`**: Auto-serializes Java outputs to JSON text objects.
* **`passwordEncoder.matches(...)`**: Safely compares form passwords to encrypted database values.

---

### ⚛️ File 7: `AuthContext.jsx` (Frontend Session Context)
*Path: `frontend/src/context/AuthContext.jsx`*
```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
```
* **`Cookies.get(...)`**: Checks browser storage on page refresh.
* **Header injection**: Registers the session key into default header configurations for future Axios operations.

---

### 📞 File 8: `api.js` (Axios Client Wrapper)
*Path: `frontend/src/services/api.js`*
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
* **`baseURL`**: Dynamically maps to the localhost backend or your live Render backend URL.
* **Request Interceptor**: Scans cookies and attaches session tags automatically to outgoing backend operations.

---

### 🗓️ File 9: `BookingForm.jsx` (Booking Interface)
*Path: `frontend/src/features/seeker/components/BookingForm.jsx`*
```javascript
  const calculateCheckOutDate = (checkInStr) => {
    if (!validateDateFormat(checkInStr)) return '';
    const checkInDate = parseDate(checkInStr);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 30); // 30-day billing cycle
    return `${d}/${m}/${y}`;
  };
```
* **`max-h-[90vh] overflow-y-auto`**: Form container style preventing button cutoff on smaller displays.
* **Open-Ended Stays**: Locks duration calculations to 30 days and disables checkout fields for monthly rentals.
* **Payment select**: Supports **PayPal** (redirect) or **Pay Owner** (instant database booking without gateway redirects).

---

### 🌐 File 10: `vercel.json` (SPA Router Setup)
*Path: `frontend/vercel.json`*
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
* **SPA redirect rule**: Overrides Vercel's default routing system. Maps all sub-page requests to the main `index.html` so React Router can process the URL path on screen reload.
