FROM node:10.16-alpine

LABEL maintainer "beiguanyi@ut.cn"

COPY . /app/

# 工作目录
WORKDIR /app

RUN npm install
RUN ls

# 暴露端口
EXPOSE 80

# 启动参数
CMD ["node","index.js"]