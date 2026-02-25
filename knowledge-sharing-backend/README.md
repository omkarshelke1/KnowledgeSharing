# 📚 Knowledge Sharing Platform — Backend

A RESTful Spring Boot backend for a knowledge sharing platform featuring JWT authentication, article management, search/filter, and AI-powered content enhancement.

---

## 🏗️ Architecture Overview

```
knowledge-sharing-backend/
├── src/main/java/com/knowledgesharing/
│   ├── config/              # Security & CORS configuration
│   ├── controller/          # REST API endpoints
│   │   ├── AuthController.java
│   │   ├── ArticleController.java
│   │   └── AiController.java
│   ├── dto/                 # Request/Response data transfer objects
│   ├── entity/              # JPA entities (User, Article)
│   ├── repository/          # Spring Data JPA repositories
│   ├── security/            # JWT utilities, auth filter, UserDetailsService
│   ├── service/             # Business logic (Auth, Article, AI)
│   └── KnowledgeSharingApplication.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

### Key Design Decisions
- **Stateless JWT auth**: No server-side sessions; tokens expire in 24h
- **Author-only mutations**: Edit/Delete enforced at service layer, not just security layer
- **AI-ready architecture**: `AiService` has pluggable design — swap `useMock=false` + add API key to switch to real AI
- **Search via JPQL**: Full-text search on title, content, tags with optional category filter

---

## 🤖 AI Usage (How AI Was Used)

| Area | AI Tool Used | What It Did |
|------|-------------|-------------|
| Boilerplate generation | Claude AI | Generated initial Spring Security + JWT config skeleton |
| Entity design | Claude AI | Suggested optimal JPA relationships and indexing strategy |
| SQL query optimization | Claude AI | Converted JPQL search query from multiple queries to single JPQL |
| Error handling | Manual | Reviewed and improved all try-catch blocks and error messages |
| AiService mock logic | Claude AI | Helped design extensible mock-to-real AI pattern |

> **Example**: "Used Claude AI to generate the initial JWT filter boilerplate and Spring Security config, then manually reviewed and customized the CORS config and authorization rules for public vs. protected routes."

---

## 🚀 Setup Instructions

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Environment Variables
Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/knowledge_sharing?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
app.jwt.secret=YOUR_JWT_SECRET_KEY_MIN_32_CHARS
app.ai.mock=true   # Set to false to use real AI API
```

### Backend Setup

```bash
# Clone the repo
git clone <your-backend-repo-url>
cd knowledge-sharing-backend

# Build
mvn clean install

# Run
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**

### MySQL Database
The database `knowledge_sharing` will be **auto-created** on first run via `createDatabaseIfNotExist=true`. Tables are auto-migrated using Hibernate DDL.

---

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/logout` | ✅ | Client-side logout |

### Articles (`/api/articles`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/articles` | ❌ | All published articles |
| GET | `/api/articles/{id}` | ❌ | Single article |
| GET | `/api/articles/search?q=&category=` | ❌ | Search & filter |
| GET | `/api/articles/my` | ✅ | Current user's articles |
| POST | `/api/articles` | ✅ | Create article |
| PUT | `/api/articles/{id}` | ✅ (author) | Update article |
| DELETE | `/api/articles/{id}` | ✅ (author) | Delete article |

### AI (`/api/ai`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/improve` | ✅ | Improve/rewrite content |
| POST | `/api/ai/summarize` | ✅ | Generate summary |
| POST | `/api/ai/suggest-tags` | ✅ | Suggest tags from content |

---

## 🛡️ Tech Stack
- **Java 17** | **Spring Boot 3.2**
- **Spring Security** + **JWT (jjwt 0.11.5)**
- **Spring Data JPA** + **Hibernate**
- **MySQL 8**
- **Lombok**
