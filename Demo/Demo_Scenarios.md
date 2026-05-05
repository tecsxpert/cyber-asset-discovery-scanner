# Day 16 Demo Scenarios — Cyber Asset Discovery Scanner

## Demo Scenario 1: Asset Management 

### Goal
Show that the user can add a cyber asset and the system can generate AI-based information.

### Exact Steps
1. Open http://localhost
2. Login using credentials.
3. Go to Asset List page.
4. Click Add Asset.
5. Enter:
   - Name: Company Web Server
   - Type: Server
   - IP Address: 192.168.1.10
   - Domain: company.com
   - Status: Active
   - Risk Score: 75
   - Description: Public-facing web server used by company website
6. Click Save/Create.
7. Open the created asset from the list.
8. Click AI Describe or wait for AI description if it appears automatically.

### Expected Output
- Asset is saved successfully.
- New asset appears in the asset table.


### Talking Points
“This scenario shows our main feature. A user can add a cyber asset like a web server. The backend stores it in PostgreSQL, and the AI service helps explain the asset risk in simple language.”

---

## Demo Scenario 2: Dashboard + Search/Filter + Export

### Goal
Show that the UI is useful for viewing and finding assets quickly.

### Exact Steps
1. Open Dashboard page.
2. Show KPI cards.
3. Show chart/analytics section.
4. Go to Asset List page.
5. Use search box and search: server
6. Change status filter to Active.
7. Click CSV Export if available.

### Expected Output
- Dashboard shows asset count and risk-related summary.
- Chart displays asset/risk information.
- Search result shows matching assets only.
- Status filter shows only selected status.
- CSV file downloads successfully.

### Talking Points
“This dashboard helps security teams quickly understand their assets. Search and filter save time when many records are present. CSV export helps teams share or review the asset list outside the system.”

---

## Demo Scenario 3: Security + AI Recommendation

### Goal
Show that protected routes, JWT security, and AI recommendation are working.

### Exact Steps
1. Logout from the application.
2. Try to open Asset List or Dashboard directly.
3. Confirm it redirects to Login page.
4. Login again.
5. Open any high-risk asset.
6. Click AI Recommend.
7. Open Swagger or Postman.
8. Call a protected API without token:
   GET http://localhost:8080/api/assets/all
9. Test invalid/injection input if available:
   <script>alert('test')</script>

### Expected Output
- Without login, protected page is blocked.
- After login, user can access the system.
- AI recommendation gives clear security actions.
- API without JWT returns 401 Unauthorized.
- Invalid/injection input is rejected or safely handled.

### Talking Points
“This scenario shows security. The system does not allow access without login. JWT protects backend APIs. The AI recommendation helps users understand what action to take for risky assets. We also tested unsafe inputs so the system is safer for demo.”