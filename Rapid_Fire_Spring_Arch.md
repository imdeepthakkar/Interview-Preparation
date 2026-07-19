## Spring Boot & Spring Framework (50 Questions)

**Q51: What is Spring Boot?**
* An extension of the Spring framework that eliminates boilerplate configurations and provides an opinionated, ready-to-run environment with embedded servers.

**Q52: What does `@SpringBootApplication` do?**
* It is a combination of three annotations: `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`.

**Q53: Spring vs Spring Boot?**
* Spring requires heavy XML or Java configuration and an external server. Spring Boot relies on auto-configuration and has embedded Tomcat/Jetty.

**Q54: What is Inversion of Control (IoC)?**
* Transferring the control of object creation and dependency management from the programmer to the Spring container.

**Q55: `@Controller` vs `@RestController`?**
* `@Controller` returns a View (HTML/JSP). `@RestController` combines `@Controller` and `@ResponseBody` to return data (JSON/XML).

**Q56: What is `@Autowired`?**
* Tells Spring to automatically inject a dependency (bean) into a class via field, constructor, or setter.

**Q57: `@Component` vs `@Bean`?**
* `@Component` is a class-level annotation used during classpath scanning. `@Bean` is a method-level annotation used inside `@Configuration` classes to explicitly declare a bean.

**Q58: `@Service` vs `@Repository`?**
* Both are specializations of `@Component`. `@Service` holds business logic. `@Repository` holds database access logic and translates SQL exceptions into Spring exceptions.

**Q59: What is Spring Data JPA?**
* An abstraction over JPA (like Hibernate) that drastically reduces boilerplate code by generating SQL queries based on method names (e.g., `findByUsername`).

**Q60: `@Primary` vs `@Qualifier`?**
* When multiple beans of the same type exist, `@Primary` marks the default bean. `@Qualifier("beanName")` explicitly specifies which one to inject.

**Q61: What is a Spring Profile?**
* Allows you to separate application configurations (like database URLs) for different environments (dev, test, prod).

**Q62: `application.properties` vs `application.yml`?**
* Both hold configurations. `.yml` uses hierarchical indentation which is easier to read for nested properties, while `.properties` uses flat key-value pairs.

**Q63: What is Spring Boot Actuator?**
* Provides built-in production-ready endpoints (like `/health`, `/metrics`, `/info`) to monitor and manage your application.

**Q64: How do you change the default port (8080)?**
* By adding `server.port=9090` in `application.properties`.

**Q65: What is AOP (Aspect-Oriented Programming)?**
* A programming paradigm that separates cross-cutting concerns (like logging, security, transactions) from the main business logic.

**Q66: Pointcut vs Advice in AOP?**
* **Pointcut:** The expression that defines *where* the code should be intercepted (e.g., all methods in a service).
* **Advice:** The actual action/code taken *when* the pointcut is reached (e.g., print log).

**Q67: Filter vs Interceptor?**
* **Filter:** Part of the Servlet API. Runs before the request reaches the Spring DispatcherServlet.
* **Interceptor:** Part of Spring. Runs after DispatcherServlet but before the Controller.

**Q68: What is Spring Security?**
* A highly customizable authentication and access-control framework for Spring applications.

**Q69: `@Transactional`?**
* Ensures that a method executes within a database transaction. If an exception occurs, the entire transaction rolls back automatically.

**Q70: Transaction Propagation?**
* Defines what happens if a transactional method is called by another transactional method (e.g., `REQUIRED`, `REQUIRES_NEW`).

**Q71: Transaction Isolation Levels?**
* Determines how transactions isolate from each other (e.g., `READ_COMMITTED`, `SERIALIZABLE`) to prevent dirty reads or phantom reads.

**Q72: `@ControllerAdvice` vs `@ExceptionHandler`?**
* `@ExceptionHandler` handles exceptions within a single controller. `@ControllerAdvice` acts as a global interceptor to handle exceptions across ALL controllers.

**Q73: What is CommandLineRunner?**
* An interface used to execute specific blocks of code exactly once, immediately after the Spring Boot application starts.

**Q74: What is Spring Boot DevTools?**
* A module providing fast application restarts, LiveReload, and sensible development-time configuration defaults.

**Q75: How to disable a specific AutoConfiguration?**
* `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})`

**Q76: What is Spring Cloud?**
* A suite of tools for building distributed systems and microservices (service discovery, routing, circuit breakers).

**Q77: What is Eureka?**
* A Service Registry in Spring Cloud where microservices register themselves so they can discover and communicate with each other.

**Q78: What is an API Gateway (Zuul / Spring Cloud Gateway)?**
* A single entry point for all clients. It routes requests to appropriate microservices and handles cross-cutting concerns like authentication and rate limiting.

**Q79: Ribbon / Spring Cloud LoadBalancer?**
* A client-side load balancer that distributes incoming requests across multiple instances of a microservice.

**Q80: What is a Feign Client?**
* A declarative web service client that makes calling other REST APIs as easy as calling a local Java interface.

**Q81: What is a Circuit Breaker (Resilience4j / Hystrix)?**
* A pattern that prevents an application from repeatedly trying to execute an operation that is likely to fail, returning a fallback response instead.

**Q82: What is `@Cacheable`?**
* Triggers cache population. If the method is called with the same parameters, the cached result is returned without executing the method.

**Q83: `@MockBean` vs `@Mock`?**
* `@Mock` is purely Mockito. `@MockBean` is Spring Boot specific; it adds a mock to the Spring ApplicationContext, replacing any existing bean of the same type.

**Q84: What is Swagger / OpenAPI?**
* A tool used to automatically generate interactive API documentation for your RESTful services.

**Q85: What is Spring Batch?**
* A framework designed to handle robust processing of large volumes of records (batch processing).

**Q86: `@Async`?**
* Marks a method to be executed in a separate thread asynchronously, returning a `CompletableFuture`.

**Q87: What is Spring WebFlux?**
* Spring's reactive-stack web framework used to build fully non-blocking, asynchronous, and event-driven applications.

**Q88: Dependency Injection Types?**
* Constructor Injection (recommended), Setter Injection, and Field Injection (not recommended).

**Q89: PathVariable vs RequestParam?**
* `@PathVariable`: Extracts values from the URI path (`/users/{id}`).
* `@RequestParam`: Extracts values from query parameters (`/users?id=5`).

**Q90: How to handle CORS in Spring Boot?**
* Using the `@CrossOrigin` annotation on the controller or configuring a global `WebMvcConfigurer`.

**Q91: Entity vs DTO?**
* **Entity:** Maps directly to a database table.
* **DTO (Data Transfer Object):** An object used to transfer specifically formatted data between the client and server without exposing the database structure.

**Q92: What is JPA vs Hibernate?**
* JPA is just a specification (interface/rules). Hibernate is the actual implementation of that specification.

**Q93: N+1 Problem in Hibernate?**
* When you fetch a list of entities (1 query) and then access their lazy-loaded relationships, triggering N additional queries. Solved via `JOIN FETCH`.

**Q94: Lazy vs Eager Loading?**
* **Eager:** Loads associated entities immediately.
* **Lazy:** Loads associated entities only when they are explicitly accessed for the first time.

**Q95: What is a Bean Scope?**
* Defines the lifecycle of a bean. Default is `Singleton` (one instance per context). Others: `Prototype` (new instance every time), `Request`, `Session`.

**Q96: What is a DispatcherServlet?**
* The Front Controller in Spring MVC. It intercepts all incoming HTTP requests and delegates them to the appropriate `@Controller`.

**Q97: Spring Boot starter dependencies?**
* Convenient dependency descriptors (e.g., `spring-boot-starter-web`) that automatically pull in all necessary libraries for a specific feature.

**Q98: Can you bypass the Spring IoC container?**
* Yes, by manually instantiating an object using the `new` keyword, but then Spring won't manage its lifecycle or inject its dependencies.

**Q99: What is Jackson?**
* The default library used by Spring Boot to serialize and deserialize Java objects into JSON.

**Q100: How to secure passwords in Spring Boot?**
* Use `BCryptPasswordEncoder` to hash passwords before storing them in the database. Never store plain text.

## System Architecture & System Design (50 Questions)

**Q101: Monolith vs Microservices?**
* **Monolith:** Single unified codebase and deployment. Easy to start, hard to scale.
* **Microservices:** Distributed suite of independent services. Highly scalable but complex to manage.

**Q102: What is REST?**
* Representational State Transfer. An architectural style that uses standard HTTP methods, statelessness, and resource-based URIs.

**Q103: PUT vs POST vs PATCH?**
* **POST:** Create a new resource.
* **PUT:** Completely replace an existing resource. Idempotent.
* **PATCH:** Partially update an existing resource.

**Q104: What is SOAP?**
* A strict, XML-based messaging protocol. Heavyweight and highly secure, often used in legacy financial systems.

**Q105: What is the CAP Theorem?**
* A distributed system can only guarantee two out of three: Consistency, Availability, and Partition Tolerance. (Networks fail, so you must choose between C or A).

**Q106: What is Event-Driven Architecture?**
* Services communicate asynchronously by emitting and listening to events/messages rather than direct API calls.

**Q107: What is CQRS?**
* Command Query Responsibility Segregation. Separating read operations (Queries) from write operations (Commands) to scale them independently.

**Q108: What is Event Sourcing?**
* Instead of storing the current state of an object, you store an append-only log of all events/changes that ever happened to it.

**Q109: Message Queue vs Pub/Sub?**
* **Message Queue:** One message is consumed by exactly one consumer (Point-to-point).
* **Pub/Sub:** One message is broadcasted to multiple independent subscribers.

**Q110: Kafka vs RabbitMQ?**
* **RabbitMQ:** Traditional message broker, pushes messages to consumers, removes them after consumption.
* **Kafka:** Distributed commit log, consumers pull messages, retains messages for a configured time. Built for massive data streaming.

**Q111: What is a Load Balancer?**
* A server that distributes incoming network traffic across multiple backend servers to ensure no single server gets overwhelmed.

**Q112: Layer 4 vs Layer 7 Load Balancing?**
* **Layer 4 (Transport):** Routes traffic based purely on IP address and TCP port. Fast.
* **Layer 7 (Application):** Routes traffic based on HTTP headers, URLs, or cookies. Smart.

**Q113: Forward Proxy vs Reverse Proxy?**
* **Forward Proxy:** Sits in front of a client and hides the client's identity from the internet (e.g., VPN).
* **Reverse Proxy:** Sits in front of a server and hides the server's identity from clients (e.g., Nginx, API Gateway).

**Q114: What is Caching?**
* Storing frequently accessed, expensive-to-compute data in fast memory (RAM) to reduce latency and database load.

**Q115: Redis vs Memcached?**
* Both are in-memory data stores. Redis supports complex data types (Lists, Sets), persistence, and replication. Memcached is strictly simple key-value strings.

**Q116: Cache Aside vs Write-Through?**
* **Cache Aside:** App checks cache; if miss, fetches from DB and updates cache.
* **Write-Through:** App writes to cache, and cache immediately writes to DB synchronously.

**Q117: What is a CDN (Content Delivery Network)?**
* A geographically distributed network of proxy servers used to cache static assets (images, JS, CSS) closer to users.

**Q118: Database Sharding?**
* A form of horizontal scaling where a single large database table is split into multiple smaller tables across different servers based on a shard key.

**Q119: Vertical vs Horizontal Scaling?**
* **Vertical (Scale Up):** Adding more CPU/RAM to a single machine. Has a hardware limit.
* **Horizontal (Scale Out):** Adding more machines to a cluster. Unlimited scaling.

**Q120: SQL vs NoSQL?**
* **SQL:** Relational, rigid schemas, ACID compliant, scales vertically.
* **NoSQL:** Non-relational, flexible schemas, BASE compliant, scales horizontally easily.

**Q121: Types of NoSQL databases?**
* Document (MongoDB), Key-Value (Redis), Column-Family (Cassandra), Graph (Neo4j).

**Q122: Eventual vs Strong Consistency?**
* **Strong:** A read immediately after a write will always return the updated value.
* **Eventual:** If no new updates are made, eventually all nodes will return the last updated value (slight delay).

**Q123: What is a Distributed Lock?**
* A mechanism (often using Redis or ZooKeeper) to ensure that a shared resource is accessed by only one process across a distributed cluster at a time.

**Q124: What is Rate Limiting?**
* Controlling the rate of traffic sent or received by a network to prevent abuse, DoS attacks, or server overload.

**Q125: Token Bucket vs Leaky Bucket?**
* Algorithms for rate limiting. Token bucket allows sudden bursts of traffic. Leaky bucket processes traffic at a strictly constant rate.

**Q126: What is Service Discovery?**
* A mechanism for microservices to dynamically locate each other on a network without hardcoded IP addresses.

**Q127: SAGA Pattern?**
* A pattern used to manage distributed transactions. Instead of a single massive ACID transaction, it uses a sequence of local transactions, triggering compensating actions if a step fails.

**Q128: Choreography vs Orchestration (SAGA)?**
* **Choreography:** Microservices publish events and react to each other independently (decentralized).
* **Orchestration:** A central controller microservice dictates the steps and commands the other services.

**Q129: Bulkhead Pattern?**
* Isolating elements of an application into separate pools so that if one fails, the others will continue to function (like watertight compartments in a ship).

**Q130: BFF (Backend for Frontend)?**
* Creating a dedicated backend API service tailored specifically for a specific frontend client (e.g., one API for Mobile, one for Web).

**Q131: What is the 12-Factor App methodology?**
* A set of best practices for building scalable, cloud-native SaaS applications (e.g., externalizing config, treating backing services as attached resources).

**Q132: What is CI/CD?**
* Continuous Integration (automating merging and testing code) and Continuous Deployment (automating the release of code to production).

**Q133: Blue-Green Deployment?**
* Having two identical production environments. You deploy the new version to "Green", test it, and instantly switch the router from "Blue" to "Green" for zero downtime.

**Q134: Canary Release?**
* Releasing a new version to a small subset of users (e.g., 5%) to monitor for errors before rolling it out to everyone.

**Q135: What is Docker?**
* A platform that packages an application and all its dependencies into a standardized unit called a container.

**Q136: Container vs Virtual Machine?**
* A VM virtualizes the entire hardware stack, including a heavy guest OS. A Container virtualizes only the OS level, making it incredibly lightweight and fast.

**Q137: What is Kubernetes?**
* An orchestration system for automating deployment, scaling, and management of containerized applications across clusters of hosts.

**Q138: What is Serverless?**
* A cloud model where the provider dynamically manages the allocation of servers (e.g., AWS Lambda). You only pay for the exact execution time of your code.

**Q139: OAuth2 vs JWT?**
* **OAuth2:** A framework/protocol for authorization (granting access).
* **JWT (JSON Web Token):** A specific token format that securely encodes claims, often used as the vehicle for OAuth2 tokens.

**Q140: What is HTTPS / TLS?**
* HTTP encrypted using Transport Layer Security. It uses asymmetric cryptography (public/private keys) for the handshake, and symmetric cryptography for the data transfer.

**Q141: What is SQL Injection?**
* A vulnerability where an attacker manipulates a backend database query by injecting malicious SQL code into input fields. Prevented by Parameterized Queries (PreparedStatement).

**Q142: What is Cross-Site Scripting (XSS)?**
* A vulnerability where an attacker injects malicious JavaScript into a webpage viewed by other users. Prevented by sanitizing input and escaping output.

**Q143: What is Cross-Site Request Forgery (CSRF)?**
* Tricking an authenticated user's browser into executing an unwanted action on a trusted site. Prevented by Anti-CSRF tokens.

**Q144: Stateful vs Stateless systems?**
* **Stateful:** The server remembers client data (session) across multiple requests.
* **Stateless:** Every request contains all the information needed to process it. The server stores no session data. Highly scalable.

**Q145: What is Database Indexing?**
* A data structure (like B-Tree) that improves the speed of data retrieval operations on a table at the cost of additional storage and slower writes.

**Q146: What is Pagination?**
* Retrieving a massive dataset in smaller chunks (pages) using `LIMIT` and `OFFSET` to prevent overwhelming memory and network bandwidth.

**Q147: WebSockets vs HTTP?**
* HTTP is unidirectional and half-duplex (client asks, server answers). WebSockets provide a persistent, bidirectional, full-duplex connection for real-time data.

**Q148: What is Dark Launching?**
* Releasing a feature into production but hiding it from the UI so backend systems are tested with real traffic before users see it.

**Q149: Idempotency?**
* Making an API call multiple times produces the exact same result as making it once. Critical for distributed systems to handle network retries safely.

**Q150: What is Long Polling?**
* A technique where the client makes an HTTP request, but the server holds the connection open until it has new data to send, simulating real-time push.
