# PM2 管理指南

## 服务状态

- **进程名称**: ecommerce-simulator
- **端口**: 3000
- **用户**: www
- **PM2 Home**: /home/www/.pm2
- **日志目录**: /home/www/.pm2/logs/

## 常用命令

### 查看状态
```bash
sudo -u www pm2 list                    # 查看所有进程
sudo -u www pm2 info ecommerce-simulator  # 查看详细信息
sudo -u www pm2 monit                   # 实时监控（CPU/内存）
```

### 日志管理
```bash
sudo -u www pm2 logs                    # 实时查看所有日志
sudo -u www pm2 logs ecommerce-simulator  # 查看指定进程日志
sudo -u www pm2 logs --lines 100        # 查看最近100行
sudo -u www pm2 flush                   # 清空日志
```

### 进程控制
```bash
sudo -u www pm2 restart ecommerce-simulator  # 重启
sudo -u www pm2 reload ecommerce-simulator   # 零停机重启
sudo -u www pm2 stop ecommerce-simulator     # 停止
sudo -u www pm2 start ecommerce-simulator    # 启动
```

### 更新代码后
```bash
cd /www/wwwroot/ecommerce-simulator
git pull
npm install
npm run build
sudo -u www pm2 reload ecommerce-simulator
```

## 自动重启配置

- 内存超过 512MB 自动重启
- 崩溃后自动重启（最多10次，间隔3秒）
- 开机自启（systemd 服务：pm2-www）

## 健康检查

```bash
curl http://localhost:3000/api/auth/providers  # 测试 API
curl http://ds.shishantech.com/               # 测试域名
```
