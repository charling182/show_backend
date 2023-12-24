# ./webapp/Dockerfile

#
# FROM node:16.18-slim

# RUN mkdir /root/egg-charling

# WORKDIR /root/egg-charling

# # 复制 package.json 和 lock 文件到工作目录
# COPY package*.json yarn.lock* ./

# # 设置 npm 和 yarn 的镜像源为淘宝镜像
# RUN npm config set registry https://registry.npm.taobao.org
# RUN yarn config set registry https://registry.npm.taobao.org

# # 安装 yarn
# # RUN npm install -g yarn

# # 安装依赖,--only=production会有警告,--verbose可以看到更多信息
# # RUN npm install --only=production
# RUN yarn install --production --verbose

#把上面的依赖步骤打成镜像,这样就不用每次都安装依赖了,依赖如果有变更,通过去对比package.json的依赖项的hash值,再做镜像

FROM 18515481949/node_modules_image:latest

# 复制项目源代码
COPY . .

# 设置环境变量
ENV EGG_SERVER_ENV prod
ENV NODE_ENV production

# 暴露端口
EXPOSE 7001

# 启动命令
CMD [ "npm", "start" ]
