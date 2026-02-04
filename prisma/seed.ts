import { PrismaClient } from '../src/generated/prisma'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ url: './dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('开始初始化数据...')

  // 创建类目（三级结构）
  const categories = [
    // 一级类目
    { id: 1, name: '电子产品', level: 1, sortOrder: 1 },
    { id: 2, name: '服装', level: 1, sortOrder: 2 },
    { id: 3, name: '家居用品', level: 1, sortOrder: 3 },
    { id: 4, name: '玩具', level: 1, sortOrder: 4 },

    // 电子产品 - 二级
    { id: 11, name: '手机', parentId: 1, level: 2, sortOrder: 1 },
    { id: 12, name: '笔记本电脑', parentId: 1, level: 2, sortOrder: 2 },
    { id: 13, name: '平板电脑', parentId: 1, level: 2, sortOrder: 3 },
    { id: 14, name: '智能手表', parentId: 1, level: 2, sortOrder: 4 },

    // 手机 - 三级
    { id: 111, name: '智能手机', parentId: 11, level: 3, sortOrder: 1 },
    { id: 112, name: '功能手机', parentId: 11, level: 3, sortOrder: 2 },
    { id: 113, name: '手机配件', parentId: 11, level: 3, sortOrder: 3 },

    // 笔记本电脑 - 三级
    { id: 121, name: '商务本', parentId: 12, level: 3, sortOrder: 1 },
    { id: 122, name: '游戏本', parentId: 12, level: 3, sortOrder: 2 },
    { id: 123, name: '轻薄本', parentId: 12, level: 3, sortOrder: 3 },

    // 服装 - 二级
    { id: 21, name: '男装', parentId: 2, level: 2, sortOrder: 1 },
    { id: 22, name: '女装', parentId: 2, level: 2, sortOrder: 2 },
    { id: 23, name: '童装', parentId: 2, level: 2, sortOrder: 3 },

    // 男装 - 三级
    { id: 211, name: 'T恤', parentId: 21, level: 3, sortOrder: 1 },
    { id: 212, name: '衬衫', parentId: 21, level: 3, sortOrder: 2 },
    { id: 213, name: '裤子', parentId: 21, level: 3, sortOrder: 3 },

    // 女装 - 三级
    { id: 221, name: '连衣裙', parentId: 22, level: 3, sortOrder: 1 },
    { id: 222, name: '上衣', parentId: 22, level: 3, sortOrder: 2 },
    { id: 223, name: '裤子', parentId: 22, level: 3, sortOrder: 3 },

    // 家居用品 - 二级
    { id: 31, name: '厨房用品', parentId: 3, level: 2, sortOrder: 1 },
    { id: 32, name: '卫浴用品', parentId: 3, level: 2, sortOrder: 2 },
    { id: 33, name: '收纳整理', parentId: 3, level: 2, sortOrder: 3 },

    // 玩具 - 二级
    { id: 41, name: '减压玩具', parentId: 4, level: 2, sortOrder: 1 },
    { id: 42, name: '益智玩具', parentId: 4, level: 2, sortOrder: 2 },
    { id: 43, name: '电动玩具', parentId: 4, level: 2, sortOrder: 3 },

    // 减压玩具 - 三级
    { id: 411, name: '减压魔方', parentId: 41, level: 3, sortOrder: 1 },
    { id: 412, name: '捏捏乐', parentId: 41, level: 3, sortOrder: 2 },
    { id: 413, name: '指尖陀螺', parentId: 41, level: 3, sortOrder: 3 },
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
      productLimit: 10000,
      draftLimit: 1000,
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
      productLimit: 5000,
      draftLimit: 500,
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
      productLimit: 3000,
      draftLimit: 500,
    },
  })

  console.log('✓ 学生账号创建完成: student1 / 123456')

  // 为 student1 创建商品分组
  const group1 = await prisma.productGroup.upsert({
    where: { name_userId: { name: '热销商品', userId: student1.id } },
    update: {},
    create: {
      name: '热销商品',
      userId: student1.id,
    },
  })

  const group2 = await prisma.productGroup.upsert({
    where: { name_userId: { name: '新品上架', userId: student1.id } },
    update: {},
    create: {
      name: '新品上架',
      userId: student1.id,
    },
  })

  console.log('✓ 商品分组创建完成')

  // 为 student1 创建一些示例商品
  const product1 = await prisma.product.create({
    data: {
      title: '苹果 iPhone 15 Pro 智能手机 256GB 黑色 全新正品',
      userId: student1.id,
      categoryId: 111,
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      keywords: 'iPhone,智能手机,苹果手机,iPhone15',
      price: 7999,
      comparePrice: 8999,
      stock: 100,
      sku: 'IP15PRO-256-BLK',
      countries: JSON.stringify(['global']),
      countryTitles: JSON.stringify({}),
      countryImages: JSON.stringify({
        default: ['/uploads/demo/iphone15pro-1.jpg', '/uploads/demo/iphone15pro-2.jpg']
      }),
      language: 'zh',
      shortDesc: '强大的 A17 Pro 芯片，全新钛金属设计',
      description: '<p>iPhone 15 Pro 采用航空级钛金属设计，搭载 A17 Pro 芯片，性能强劲。</p><p>主要特点：</p><ul><li>6.1 英寸超视网膜 XDR 显示屏</li><li>A17 Pro 芯片</li><li>Pro 级摄像头系统</li><li>USB-C 接口</li></ul>',
      images: JSON.stringify(['/uploads/demo/iphone15pro-1.jpg', '/uploads/demo/iphone15pro-2.jpg']),
      mainImage: '/uploads/demo/iphone15pro-1.jpg',
      weight: 0.3,
      packageSize: JSON.stringify({ length: 15, width: 8, height: 3 }),
      shippingTemplate: '标准运费模板',  // 改为 String
      status: 'published',
      hasSale: true,
      sales30d: 156,
      views30d: 12580,
      visitors30d: 3200,
      conversion30d: 0.0487,
      paymentAmount30d: 124800,
      payingBuyers30d: 156,
      avgOrderValue30d: 800,
      chartData: JSON.stringify([100, 120, 150, 130, 180, 200, 220]),
      visitorsChartData: JSON.stringify([300, 350, 400, 380, 420, 450, 500]),
      optimizationStatus: '影响转化',
      optimizationTasks: 2,
      optimizationWarnings: JSON.stringify(['标题可以优化', '图片数量不足']),
    },
  })

  // 关联商品到分组
  await prisma.productToGroup.create({
    data: {
      productId: product1.id,
      groupId: group1.id,
    },
  })

  const product2 = await prisma.product.create({
    data: {
      title: '联想 ThinkPad X1 Carbon 笔记本电脑 14英寸商务旗舰',
      userId: student1.id,
      categoryId: 121,
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon Gen 11',
      keywords: '笔记本,商务本,ThinkPad,联想',
      price: 12999,
      comparePrice: 14999,
      stock: 50,
      sku: 'TP-X1C11-I7-16G',
      countries: JSON.stringify(['global']),
      countryTitles: JSON.stringify({}),
      countryImages: JSON.stringify({
        default: ['/uploads/demo/thinkpad-1.jpg']
      }),
      language: 'zh',
      shortDesc: '14英寸商务旗舰笔记本，仅重 1.12kg',
      description: '<p>ThinkPad X1 Carbon 是联想旗舰商务笔记本，轻薄便携，性能强劲。</p>',
      images: JSON.stringify(['/uploads/demo/thinkpad-1.jpg']),
      mainImage: '/uploads/demo/thinkpad-1.jpg',
      weight: 1.5,
      shippingTemplate: '免运费模板',  // 改为 String
      status: 'draft',
      sales30d: 0,
      views30d: 0,
      visitors30d: 0,
    },
  })

  // 关联商品到分组
  await prisma.productToGroup.create({
    data: {
      productId: product2.id,
      groupId: group2.id,
    },
  })

  // 创建更多示例商品
  const product3 = await prisma.product.create({
    data: {
      title: '减压魔方 六面解压神器 办公室减压玩具 成人儿童通用',
      userId: student1.id,
      categoryId: 411,
      brand: '自有品牌',
      keywords: '减压魔方,解压玩具,减压神器',
      price: 29.9,
      comparePrice: 49.9,
      stock: 500,
      sku: 'TOY-CUBE-001',
      countries: JSON.stringify(['es', 'fr', 'de', 'it']),
      countryTitles: JSON.stringify({
        es: 'Cubo antiestrés',
        fr: 'Cube anti-stress',
        de: 'Anti-Stress-Würfel',
        it: 'Cubo antistress'
      }),
      countryImages: JSON.stringify({
        default: ['/uploads/demo/cube-1.jpg', '/uploads/demo/cube-2.jpg']
      }),
      language: 'en',
      shortDesc: '多功能减压魔方，缓解焦虑',
      description: '<p>多功能减压魔方，六面不同设计，有效缓解焦虑和压力。</p>',
      images: JSON.stringify(['/uploads/demo/cube-1.jpg', '/uploads/demo/cube-2.jpg']),
      mainImage: '/uploads/demo/cube-1.jpg',
      weight: 0.1,
      packageSize: JSON.stringify({ length: 5, width: 5, height: 5 }),
      shippingTemplate: '小件包邮',
      status: 'published',
      hasSale: true,
      isFlash: true,
      sales30d: 1280,
      views30d: 45000,
      visitors30d: 8500,
      conversion30d: 0.1505,
      paymentAmount30d: 38272,
      payingBuyers30d: 1280,
      avgOrderValue30d: 29.9,
      chartData: JSON.stringify([500, 600, 800, 1000, 1200, 1500, 1800]),
      visitorsChartData: JSON.stringify([1000, 1200, 1400, 1300, 1500, 1600, 1800]),
      wholesaleEnabled: true,
      wholesaleMinQuantity: 10,
      wholesaleDiscount: 20,
    },
  })

  await prisma.productToGroup.create({
    data: {
      productId: product3.id,
      groupId: group1.id,
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
