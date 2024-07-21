FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

# 复制 package.json 和相关文件
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# 安装依赖项
RUN npm install --production --silent && mv node_modules ../

# 复制所有文件
COPY . .

# 构建应用
RUN npm run build

EXPOSE 3000

# 更改文件所有权
RUN chown -R node /usr/src/app

# 切换用户
USER node

# 启动命令
CMD ["npm", "start"]