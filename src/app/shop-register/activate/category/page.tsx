'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UserOutlined, CloseOutlined, PlusOutlined, QuestionCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { Select, Input, Checkbox, Button, Space } from 'antd'

const CATEGORY_OPTIONS = [
  { value: '整车', label: '整车' },
  { value: '家居家具家装灯具工具', label: '家居家具家装灯具工具' },
  { value: '成人用品', label: '成人用品' },
  { value: '母婴玩具', label: '母婴玩具' },
  { value: '服装服饰', label: '服装服饰' },
  { value: '二手手机', label: '二手手机' },
  { value: '黑人真人发', label: '黑人真人发' },
  { value: '汽摩配', label: '汽摩配' },
  { value: '消费电子', label: '消费电子' },
  { value: '家用电器', label: '家用电器' },
  { value: '运动户外', label: '运动户外' },
  { value: '珠宝配饰', label: '珠宝配饰' },
]

const SPECIAL_CATEGORIES: Record<string, string[]> = {
  '母婴玩具': ['异形玩具', '体温计', '母婴护肤品', '母婴健康护理', '母婴保健食品', '母婴玩具大件'],
  '成人用品': ['情趣用品', '成人健康用品', '成人玩具'],
  '整车': ['新能源汽车', '摩托车', '电动车', '特种车辆'],
  '医疗健康': ['医疗器械', '保健食品', '处方药', '医用耗材'],
}

export default function CategoryPage() {
  const router = useRouter()
  const [category, setCategory] = useState<string | null>(null)
  const [specialSelected, setSpecialSelected] = useState<string[]>([])
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [dingBound, setDingBound] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const specialCategories = category ? (SPECIAL_CATEGORIES[category] ?? []) : []

  const handleGetCode = () => {
    if (countdown > 0) return
    setCountdown(60)
    // 自动填入随机验证码
    setCode(String(Math.floor(100000 + Math.random() * 900000)))
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleBind = () => {
    setDingBound(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F6FA', paddingBottom: 72 }}>

      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="flex items-center px-6" style={{ height: 52 }}>
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 mr-6">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1677ff, #4096ff)' }}>
              <span className="text-white font-bold italic" style={{ fontSize: 16 }}>S</span>
            </div>
            <div>
              <div className="font-semibold leading-tight" style={{ fontSize: 13 }}>跨境卖家中心</div>
              <div className="text-gray-400 leading-tight" style={{ fontSize: 10 }}>Cross-border Seller Center</div>
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex items-center border rounded"
            style={{ borderColor: '#e8e8e8', height: 32, overflow: 'hidden' }}>
            <div className="flex items-center gap-1.5 px-3 h-full"
              style={{ backgroundColor: '#f5f8ff', borderRight: '1px solid #e8e8e8' }}>
              <div className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF4422', fontSize: 8, color: '#fff', fontWeight: 700 }}>AE</div>
              <span className="text-xs font-medium" style={{ color: '#1677ff' }}>AliExpress</span>
              <span className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#FFF7E6', color: '#FA8C16', border: '1px solid #FFD591', fontSize: 10 }}>
                开店中
              </span>
              <CloseOutlined style={{ fontSize: 10, color: '#bfbfbf', marginLeft: 2, cursor: 'pointer' }} />
            </div>
            <div className="flex items-center px-3 h-full text-xs text-gray-400 cursor-pointer hover:bg-gray-50"
              style={{ gap: 4 }}>
              <PlusOutlined style={{ fontSize: 10 }} />
            </div>
          </div>

          <span className="text-sm text-gray-600 ml-2">AliExpress Store</span>

          <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ backgroundColor: '#ff4d4f' }}>
            <UserOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="px-6 py-6" style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* 页面标题 */}
        <h1 className="font-bold mb-5" style={{ fontSize: 20, color: '#1a1a2e' }}>选择店铺主要售卖类目</h1>

        {/* 白色主卡片 */}
        <div className="bg-white rounded-xl" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px 36px' }}>

          {/* 类目信息 */}
          <section className="mb-6">
            <h2 className="font-semibold mb-4" style={{ fontSize: 15, color: '#1a1a2e' }}>类目信息</h2>

            <div className="mb-4">
              <label className="block mb-1.5" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>
                类目权限{' '}
                <QuestionCircleOutlined style={{ fontSize: 13, color: '#bfbfbf', cursor: 'pointer' }} />
              </label>
              <p className="mb-2" style={{ fontSize: 12, color: '#8c8c8c' }}>
                请选择品牌类目，只能添加同一品牌下的需要相同资质的类目
              </p>
              <Select
                placeholder="请输入"
                style={{ width: 200 }}
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={val => {
                  setCategory(val)
                  setSpecialSelected([])
                }}
              />
            </div>

            {/* 特殊类目（选择后显示） */}
            {category && specialCategories.length > 0 && (
              <div className="mt-4">
                <label className="block mb-1.5" style={{ fontSize: 13, color: '#262626' }}>
                  特殊类目（多选）{' '}
                  <QuestionCircleOutlined style={{ fontSize: 13, color: '#bfbfbf', cursor: 'pointer' }} />
                </label>
                <p className="mb-2" style={{ fontSize: 12, color: '#8c8c8c' }}>
                  你选择的经营大类含特殊类目，如果你需要开通特殊的经营权限，请勾选你要经营的类目，上传资质文件，通过审核后即可在平台上售卖。
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {specialCategories.map(item => (
                    <Checkbox
                      key={item}
                      checked={specialSelected.includes(item)}
                      onChange={e => {
                        setSpecialSelected(prev =>
                          e.target.checked ? [...prev, item] : prev.filter(x => x !== item)
                        )
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#262626' }}>{item}</span>
                    </Checkbox>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

          {/* 钉钉账号绑定 */}
          <section>
            <h2 className="font-semibold mb-1.5" style={{ fontSize: 15, color: '#1a1a2e' }}>钉钉账号绑定</h2>
            <p className="mb-4" style={{ fontSize: 12, color: '#8c8c8c' }}>
              完成钉钉绑定，即可获得官方小二支持，第一时间获取行业信息。
            </p>

            {dingBound ? (
              /* 绑定成功横幅 */
              <div className="flex items-center gap-2 rounded px-4 py-3"
                style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
                <span style={{ fontSize: 14, color: '#262626' }}>钉钉账号绑定成功。</span>
              </div>
            ) : (
              <>
                {/* 手机号 */}
                <div className="mb-4">
                  <label className="block mb-1.5" style={{ fontSize: 13, color: '#262626' }}>
                    <span style={{ color: '#ff4d4f' }}>* </span>请填写手机号码
                  </label>
                  <Space.Compact>
                    <Input
                      value="+86"
                      readOnly
                      style={{ width: 56, textAlign: 'center', color: '#595959', backgroundColor: '#fafafa' }}
                    />
                    <Input
                      placeholder="请输入"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{ width: 200 }}
                    />
                  </Space.Compact>
                </div>

                {/* 验证码 */}
                <div className="mb-4">
                  <label className="block mb-1.5" style={{ fontSize: 13, color: '#262626' }}>
                    <span style={{ color: '#ff4d4f' }}>* </span>验证码
                  </label>
                  <Space.Compact>
                    <Input
                      placeholder="请输入"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      style={{ width: 200 }}
                    />
                    <Button
                      onClick={handleGetCode}
                      disabled={countdown > 0}
                      style={{ minWidth: 96 }}
                    >
                      {countdown > 0 ? `${countdown}s后重试` : '获取验证码'}
                    </Button>
                  </Space.Compact>
                </div>

                <Button
                  type="primary"
                  style={{ backgroundColor: '#1677ff', minWidth: 88 }}
                  onClick={handleBind}
                >
                  确认绑定
                </Button>
              </>
            )}
          </section>
        </div>
      </div>

      {/* FAQ - fixed 定位 */}
      <div className="fixed bg-white rounded-xl p-5"
        style={{ right: 24, top: 80, width: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 className="font-semibold mb-3" style={{ fontSize: 14, color: '#1a1a2e' }}>FAQ</h3>
        <p className="text-sm cursor-pointer" style={{ color: '#1677ff' }}>· AE店铺激活常见问题</p>
      </div>

      {/* 底部固定工具栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between px-6"
        style={{ height: 56, borderTop: '1px solid #e8e8e8', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <Button size="large" style={{ minWidth: 72 }} onClick={() => router.back()}>返回</Button>
        <div className="flex gap-3">
          <Button size="large" style={{ minWidth: 72 }}>保存</Button>
          <Button
            type="primary"
            size="large"
            style={{ minWidth: 72, backgroundColor: '#1677ff' }}
            onClick={() => router.push('/shop-register/activate?step=3')}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  )
}
