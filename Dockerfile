# ./webapp/Dockerfile

FROM node:16.18-slim

RUN mkdir /root/egg-charling

WORKDIR /root/egg-charling

# 复制 package.json 和 lock 文件到工作目录
COPY package*.json yarn.lock* ./

# 安装依赖
RUN npm install --only=production

# 复制项目源代码
COPY . .

# 设置环境变量
ENV EGG_SERVER_ENV prod
ENV NODE_ENV production

# 暴露端口
EXPOSE 7001

# 启动命令
CMD [ "npm", "start" ]
