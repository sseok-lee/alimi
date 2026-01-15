# Deployment Guide (배포 가이드)

> CI/CD 파이프라인 구축 및 운영 가이드

---

## MVP 캡슐

| # | 항목 | 내용 |
|---|------|------|
| 1 | 목표 | 국민 누구나 공공데이터 기반으로 맞춤형 지원금을 쉽게 찾을 수 있는 서비스 제공 |
| 2 | 페르소나 | 모든 연령층 (학생, 직장인, 프리랜서, 주부, 은퇴자 등) |
| 3 | 핵심 기능 | FEAT-1: 나이/소득/지역 입력 맞춤형 지원금 매칭 |
| 4 | 성공 지표 (노스스타) | 월 애드센스 수익 목표 달성 |
| 5 | 입력 지표 | 일 방문자 수(DAU), 검색 전환율 |
| 6 | 비기능 요구 | SEO 최적화 (구글 검색 노출), 페이지 로딩 속도 < 3초 |
| 7 | Out-of-scope | 소셜 로그인, 이메일 알림, 복잡한 필터링은 v2 이후 |
| 8 | Top 리스크 | 공공데이터 API 불안정 또는 데이터 품질 문제 |
| 9 | 완화/실험 | 여러 공공 API 소스 통합, 데이터 캐싱 전략 수립 |
| 10 | 다음 단계 | Phase 0 계약 정의 및 테스트 케이스 작성 시작 |

---

## 1. 배포 환경 개요

### 1.1 프로덕션 환경

| 항목 | 내용 |
|------|------|
| 호스팅 | Cafe24 가상서버 호스팅 |
| IP 주소 | 183.111.126.54 |
| OS | Ubuntu/Debian |
| Web Server | Nginx 1.18.0 |
| Process Manager | PM2 6.0.14 |
| Node.js | v20.19.6 |
| MySQL | 서버 내 설치 |

### 1.2 서버 아키텍처

```
                        Internet
                           │
                           ▼
                    ┌─────────────────┐
                    │   Nginx :80     │ (리버스 프록시)
                    └─────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │  Nuxt SSR       │         │  Express API    │
    │  Port: 3000     │         │  Port: 8000     │
    │  PM2: alimi-    │         │  PM2: alimi-    │
    │  frontend       │         │  backend        │
    └─────────────────┘         └─────────────────┘
                                        │
                                        ▼
                                ┌─────────────────┐
                                │  MySQL          │
                                │  Port: 3306     │
                                └─────────────────┘
```

---

## 2. CI/CD 파이프라인

### 2.1 배포 플로우

```
로컬 개발 → Git Push (main) → GitHub Actions → 빌드 → SSH 배포 → PM2 재시작 → 배포 완료
```

### 2.2 GitHub Actions 워크플로우

**파일**: `.github/workflows/deploy.yml`

**트리거**: `git push origin main`

**단계:**
1. **Checkout code**: 소스코드 체크아웃
2. **Setup Node.js**: Node.js 20 환경 설정
3. **Build Backend**: Express TypeScript 빌드
4. **Build Frontend**: Nuxt SSR 빌드
5. **Deploy to Server**: SCP로 빌드 파일 전송
6. **Restart Services**: SSH로 접속하여 PM2 재시작

### 2.3 GitHub Secrets 설정

GitHub 저장소 → Settings → Secrets and variables → Actions

| Secret 이름 | 값 | 설명 |
|-------------|-----|------|
| `CAFE24_HOST` | 183.111.126.54 | 서버 IP 주소 |
| `CAFE24_USER` | root | SSH 사용자명 |
| `CAFE24_SSH_KEY` | (SSH 개인키) | SSH 인증용 개인키 |

---

## 3. 서버 초기 설정

### 3.1 SSH 키 생성 (서버에서)

```bash
# GitHub Actions용 SSH 키 생성
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""

# 공개키를 authorized_keys에 추가
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# 권한 설정
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 개인키 출력 (GitHub Secrets에 등록)
cat ~/.ssh/github_actions
```

### 3.2 디렉토리 구조

```bash
/home/project1/alimi/
├── backend/
│   ├── dist/              # 빌드된 JavaScript 파일
│   ├── prisma/            # Prisma 스키마
│   ├── package.json
│   ├── package-lock.json
│   └── .env              # 환경변수
└── frontend/
    ├── .output/          # Nuxt 빌드 결과
    │   └── server/       # SSR 서버 파일
    ├── package.json
    └── package-lock.json
```

### 3.3 환경변수 설정

**백엔드 환경변수** (`/home/project1/alimi/backend/.env`):

```bash
# Database
DATABASE_URL=mysql://alimi:password@localhost:3306/alimi

# Server
PORT=8000
NODE_ENV=production

# CORS
CORS_ORIGIN=http://183.111.126.54:3000

# Public API
OPENAPI_SERVICE_KEY=43006692951fc050808d9f8f3fe5c5d76426bdaf2bcf308933f1aeeff539011b
OPENAPI_BASE_URL=https://api.odcloud.kr/api
```

**권한 설정:**
```bash
chmod 600 /home/project1/alimi/backend/.env
```

### 3.4 MySQL 데이터베이스 설정

**MySQL 접속:**
```bash
mysql -u root -p
```

**데이터베이스 및 사용자 생성:**
```sql
-- 데이터베이스 생성 (UTF-8 설정)
CREATE DATABASE alimi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성
CREATE USER 'alimi'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON alimi.* TO 'alimi'@'localhost';
FLUSH PRIVILEGES;

-- 확인
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'alimi';

-- 종료
exit;
```

**Prisma 스키마 적용:**
```bash
# 백엔드 디렉토리로 이동
cd /home/project1/alimi/backend

# 환경변수 확인 (DATABASE_URL이 올바른지)
cat .env | grep DATABASE_URL

# Prisma 클라이언트 생성
npx prisma generate

# 스키마 적용 (개발 환경 - 빠름)
npx prisma db push

# 또는 마이그레이션 실행 (프로덕션 권장)
npx prisma migrate deploy

# 연결 테스트
npx prisma db execute --stdin <<< "SELECT 1"
```

**백엔드 재시작:**
```bash
pm2 restart alimi-backend
pm2 logs alimi-backend --lines 20
```

**데이터베이스 연결 확인:**
```bash
# 백엔드 로그에서 DB 연결 확인
pm2 logs alimi-backend | grep -i "database\|prisma\|mysql"

# API health check
curl http://localhost:8000/api/health
```

---

## 4. Nginx 설정

### 4.1 Nginx 리버스 프록시 설정

**파일**: `/etc/nginx/sites-available/alimi`

```nginx
server {
    listen 80;
    server_name 183.111.126.54;

    client_max_body_size 10M;

    # API 요청은 백엔드로 프록시
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 나머지 요청은 프론트엔드로 프록시
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4.2 Nginx 활성화

```bash
# 심볼릭 링크 생성
ln -sf /etc/nginx/sites-available/alimi /etc/nginx/sites-enabled/

# 기본 설정 비활성화
rm -f /etc/nginx/sites-enabled/default

# 설정 테스트
nginx -t

# Nginx 재시작
systemctl restart nginx

# 자동 시작 설정
systemctl enable nginx
```

---

## 5. PM2 프로세스 관리

### 5.1 PM2 프로세스 시작

```bash
# 백엔드 시작
cd /home/project1/alimi/backend
pm2 start dist/index.js --name alimi-backend

# 프론트엔드 시작
cd /home/project1/alimi/frontend
pm2 start .output/server/index.mjs --name alimi-frontend

# PM2 설정 저장 (재부팅 시 자동 시작)
pm2 save

# 시스템 재시작 시 PM2 자동 시작 설정
pm2 startup
```

### 5.2 PM2 명령어

```bash
# 프로세스 목록 확인
pm2 list

# 로그 확인
pm2 logs                          # 전체 로그
pm2 logs alimi-backend --lines 50 # 백엔드 로그 50줄
pm2 logs alimi-frontend --lines 50 # 프론트엔드 로그 50줄

# 프로세스 재시작
pm2 restart alimi-backend
pm2 restart alimi-frontend
pm2 restart all

# 프로세스 중지
pm2 stop alimi-backend
pm2 stop all

# 프로세스 삭제
pm2 delete alimi-backend
pm2 delete all

# 실시간 모니터링
pm2 monit

# 프로세스 상태
pm2 status
```

---

## 6. 배포 프로세스

### 6.1 자동 배포 (GitHub Actions)

```bash
# 로컬에서 코드 수정 후
git add .
git commit -m "feat: 새 기능 추가

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# main 브랜치에 푸시
git push origin main

# GitHub Actions가 자동으로 배포 시작
# https://github.com/sseok-lee/alimi/actions 에서 진행 상황 확인
```

### 6.2 수동 배포 (긴급 시)

```bash
# 서버 SSH 접속
ssh root@183.111.126.54

# 최신 코드 pull (Git 설정된 경우)
cd /home/project1/alimi
git pull origin main

# 백엔드 빌드 및 재시작
cd backend
npm ci --production
npm run build
pm2 restart alimi-backend

# 프론트엔드 빌드 및 재시작
cd ../frontend
npm ci --production
npm run build
pm2 restart alimi-frontend
```

---

## 7. 모니터링 및 트러블슈팅

### 7.1 서비스 상태 확인

```bash
# PM2 프로세스 확인
pm2 list

# Nginx 상태 확인
systemctl status nginx

# MySQL 상태 확인
systemctl status mysql

# 디스크 사용량 확인
df -h

# 메모리 사용량 확인
free -h

# 프로세스 확인
top
htop
```

### 7.2 로그 확인

```bash
# PM2 로그
pm2 logs --lines 100

# Nginx 로그
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MySQL 로그
tail -f /var/log/mysql/error.log

# 시스템 로그
journalctl -xe
```

### 7.3 일반적인 문제 해결

#### 문제 1: 프론트엔드/백엔드가 실행되지 않음

```bash
# PM2 로그 확인
pm2 logs alimi-backend --err
pm2 logs alimi-frontend --err

# 프로세스 재시작
pm2 restart all

# 필요시 프로세스 삭제 후 재시작
pm2 delete all
cd /home/project1/alimi/backend
pm2 start dist/index.js --name alimi-backend
cd /home/project1/alimi/frontend
pm2 start .output/server/index.mjs --name alimi-frontend
pm2 save
```

#### 문제 2: 데이터베이스 연결 오류

```bash
# MySQL 상태 확인
systemctl status mysql

# MySQL 재시작
systemctl restart mysql

# 환경변수 확인
cat /home/project1/alimi/backend/.env

# 연결 테스트
mysql -u alimi -p -e "SELECT 1"
```

#### 문제 3: Nginx 502 Bad Gateway

```bash
# 백엔드/프론트엔드 프로세스 확인
pm2 list

# 프로세스가 실행 중이면 포트 확인
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Nginx 설정 테스트
nginx -t

# Nginx 재시작
systemctl restart nginx
```

#### 문제 4: 디스크 용량 부족

```bash
# 디스크 사용량 확인
df -h

# PM2 로그 정리
pm2 flush

# 오래된 로그 삭제
find /var/log -type f -name "*.log" -mtime +30 -delete

# NPM 캐시 정리
npm cache clean --force
```

---

## 8. 보안 체크리스트

### 8.1 서버 보안

- [x] SSH 키 기반 인증 사용
- [x] Root 로그인 제한 (필요시)
- [ ] 방화벽 설정 (UFW)
- [ ] 자동 보안 업데이트 설정
- [ ] SSL/TLS 인증서 설치 (Let's Encrypt)

### 8.2 애플리케이션 보안

- [x] 환경변수로 민감 정보 관리
- [x] CORS 설정
- [x] Helmet.js (보안 헤더)
- [ ] Rate Limiting (API 요청 제한)
- [ ] Input Validation (Zod 스키마)

### 8.3 데이터베이스 보안

- [x] MySQL 비밀번호 설정
- [x] 환경변수로 DB 인증 정보 관리
- [ ] 정기적인 백업 설정
- [ ] 불필요한 권한 제거

---

## 9. 백업 및 복구

### 9.1 데이터베이스 백업

```bash
# 수동 백업
mysqldump -u alimi -p alimi > /backup/alimi_$(date +%Y%m%d).sql

# 자동 백업 (Cron 설정)
# /etc/cron.daily/mysql-backup.sh
#!/bin/bash
mysqldump -u alimi -p'password' alimi > /backup/alimi_$(date +%Y%m%d).sql
find /backup -name "alimi_*.sql" -mtime +7 -delete
```

### 9.2 복구

```bash
# 데이터베이스 복구
mysql -u alimi -p alimi < /backup/alimi_20260115.sql
```

---

## 10. 성능 최적화

### 10.1 Nginx 캐싱 (v2)

```nginx
# 정적 파일 캐싱
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 10.2 PM2 클러스터 모드 (v2)

```bash
# 클러스터 모드로 실행 (CPU 코어 수만큼)
pm2 start dist/index.js -i max --name alimi-backend
```

### 10.3 MySQL 쿼리 최적화

- 인덱스 최적화
- 슬로우 쿼리 로그 분석
- 커넥션 풀 설정

---

## Decision Log 참조

| ID | 항목 | 선택 | 근거 |
|----|------|------|------|
| D-11 | 호스팅 | Cafe24 가상서버 호스팅 | 전체 제어 가능, MySQL/Nginx 포함, 장기 운영 |
| D-12 | 웹서버 | Nginx | 리버스 프록시, 성능, SSL 지원 |
| D-13 | 프로세스 관리 | PM2 | 자동 재시작, 로그 관리, 무중단 배포 |
| D-14 | CI/CD | GitHub Actions | 무료, GitHub 통합, SSH 배포 가능 |
| D-27 | SSH 인증 | ED25519 키 | 보안성 우수, GitHub Actions 호환 |
| D-28 | 빌드 모드 | SSR (npm run build) | SEO 최적화, 서버 사이드 렌더링 |
| D-29 | DB 위치 | 서버 내 MySQL | 낮은 레이턴시, 비용 절감, 전체 제어 |
| D-30 | DB 문자셋 | utf8mb4 | 이모지 지원, 한글 완벽 지원 |
