import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Получаем __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development', // или 'production'
  entry: './src/client/index.js', // Entry point
  output: {
    path: path.resolve(__dirname, 'dist'), // Куда положить бандл
    filename: 'main.js', // Имя бандла
    clean: true, // Очищать папку dist перед сборкой
  },
  module: {
    rules: [
      // Babel для JS
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][hash][ext]',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff2?|ttf|eot|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][hash][ext]',
        },
      } 
    ],
  },
  plugins: [
    // Автоматически добавляет скрипт в HTML
    new HtmlWebpackPlugin({
      template: './src/client/index.html',
      filename: 'index.html',
      inject: 'body' 
    })
  ],
  devServer: {
    compress: true,
    port: 3000, // Порт дев-сервера
    hot: true,
    open: true,
    proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:7070',
      changeOrigin: true,
    }
    ]
  },
};