# 1. Build 階段：用 Node 建置 Vite 專案
FROM node:20-alpine AS build
WORKDIR /app

# 先複製 package 檔案，利用 Docker 快取
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 再複製原始碼並建置
COPY . ./
RUN yarn build

# 2. Runtime 階段：用 Nginx 服務靜態檔案
FROM nginx:alpine

# 複製建置結果
COPY --from=build /app/dist /usr/share/nginx/html

# 建議加入自訂 Nginx 設定（處理 SPA 路由）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]