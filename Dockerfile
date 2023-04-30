# ./webapp/Dockerfile

FROM node:16.18-slim

RUN mkdir /root/egg-charling

WORKDIR /root/egg-charling

COPY . .

# 安装依赖
RUN npm install --production

# 启动命令
CMD [ "npm", "start" ]
