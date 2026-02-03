import { PrismaClient } from '../src/generated/prisma'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ url: './prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('开始初始化数据...')

  // 创建类目
  const categories = [
    { id: 1, name: '电子产品', level: 1 },
    { id: 2, name: '手机', parentId: 1, level: 2 },
    { id: 3, name: '笔记本电脑', parentId: 1, level: 2 },
    { id: 4, name: '服装', level: 1 },
    { id: 5, name: '男装', parentId: 4, level: 2 },
    { id: 6, name: '女装', parentId: 4, level: 2 },
    { id: 7, name: '家居用品', level: 1 },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    })
  }

  console.log('✓ 类目创建完成')

  // 创建管理员账号
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: '管理员',
      email: 'admin@example.com',
      role: 'admin',
    },
  })

  console.log('✓ 管理员账号创建完成: admin / admin123')

  // 创建教师账号
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacher = await prisma.user.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      password: teacherPassword,
      name: '张老师',
      email: 'teacher@example.com',
      role: 'teacher',
    },
  })

  console.log('✓ 教师账号创建完成: teacher / teacher123')

  // 创建测试学生账号
  const student1Password = await bcrypt.hash('123456', 10)
  const student1 = await prisma.user.upsert({
    where: { username: 'student1' },
    update: {},
    create: {
      username: 'student1',
      password: student1Password,
      name: '李明',
      email: 'student1@example.com',
      role: 'student',
    },
  })

  console.log('✓ 学生账号创建完成: student1 / 123456')

  // 为 student1 创建一些示例商品
  await prisma.product.create({
    data: {
      title: '苹果 iPhone 15 Pro 智能手机',
      userId: student1.id,
      categoryId: 2,
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      keywords: 'iPhone,智能手机,苹果手机',
      price: 7999,
      comparePrice: 8999,
      stock: 100,
      sku: 'IP15PRO-256-BLK',
      shortDesc: '强大的 A17 Pro 芯片，全新钛金属设计',
      description: '<p>iPhone 15 Pro 采用航空级钛金属设计，搭载 A17 Pro 芯片，性能强劲。</p><p>主要特点：</p><ul><li>6.1 英寸超视网膜 XDR 显示屏</li><li>A17 Pro 芯片</li><li>Pro 级摄像头系统</li><li>USB-C 接口</li></ul>',
      images: JSON.stringify([
        '/uploads/demo/iphone15pro-1.jpg',
        '/uploads/demo/iphone15pro-2.jpg',
      ]),
      mainImage: '/uploads/demo/iphone15pro-1.jpg',
      weight: 0.3,
      packageSize: JSON.stringify({ length: 15, width: 8, height: 3 }),
      status: 'published',
    },
  })

  await prisma.product.create({
    data: {
      title: '联想 ThinkPad X1 Carbon 笔记本电脑',
      userId: student1.id,
      categoryId: 3,
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon Gen 11',
      keywords: '笔记本,商务本,ThinkPad',
      price: 12999,
      comparePrice: 14999,
      stock: 50,
      sku: 'TP-X1C11-I7-16G',
      shortDesc: '14英寸商务旗舰笔记本，仅重 1.12kg',
      description: '<p>ThinkPad X1 Carbon 是联想旗舰商务笔记本，轻薄便携，性能强劲。</p>',
      images: JSON.stringify(['/uploads/demo/thinkpad-1.jpg']),
      mainImage: '/uploads/demo/thinkpad-1.jpg',
      weight: 1.5,
      status: 'draft',
    },
  })

  console.log('✓ 示例商品创建完成')

  console.log('\n数据库初始化完成！')
  console.log('\n测试账号：')
  console.log('  管理员: admin / admin123')
  console.log('  教师: teacher / teacher123')
  console.log('  学生: student1 / 123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
