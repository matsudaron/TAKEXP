# ベースイメージ
FROM node:20-bullseye

# 環境変数を設定
ENV NODE_OPTIONS="--max-old-space-size=2048"

# 作業ディレクトリ設定
WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json /app/
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバー起動
CMD ["npm", "start"]

# ポート指定
EXPOSE 3000