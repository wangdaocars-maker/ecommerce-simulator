'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Select, Button, Progress, Tooltip } from 'antd'
import {
  ExclamationCircleFilled,
  RobotOutlined,
  CheckCircleFilled,
  LoadingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'

const GREEN = '#52c41a'
const BLUE = '#1677ff'

// ==================== 属性定义 ====================
interface AttrDef {
  id: string
  label: string
  labelEn: string
  required: boolean
  mode?: 'multiple'
  hasInfo?: boolean
  special?: 'brand'
  options: { value: string; labelEn: string; hasInfo?: boolean }[]
}

const ATTRS: AttrDef[] = [
  {
    id: 'feature', label: '特征', labelEn: 'Feature', required: true,
    options: [
      { value: '软垫皮革', labelEn: 'Upholstered leather' },
      { value: '旋转', labelEn: 'Rotating' },
      { value: '头部支撑', labelEn: 'Head Support' },
      { value: '靠垫可用性', labelEn: 'Cushion available' },
      { value: '人体工程学', labelEn: 'Ergonomic' },
      { value: '可调节腰部', labelEn: 'Adjustable lumbar support' },
      { value: '可调节扶手', labelEn: 'Adjustable armrests' },
    ],
  },
  {
    id: 'fillingMaterial', label: '填充材料', labelEn: 'Filling Material', required: true,
    options: [
      { value: '棉', labelEn: 'Cotton' },
      { value: '羽毛', labelEn: 'Feather' },
      { value: '聚苯乙烯', labelEn: 'Polystyrene' },
      { value: '聚酯', labelEn: 'Polyester' },
      { value: '记忆海绵', labelEn: 'Memory Foam' },
      { value: '泡沫', labelEn: 'Foam' },
    ],
  },
  {
    id: 'backStyle', label: '背面样式', labelEn: 'Back Style', required: true,
    options: [
      { value: '开背', labelEn: 'Open Back' },
      { value: '交叉背', labelEn: 'Crossback' },
      { value: '翼背', labelEn: 'Wing' },
      { value: '实心背', labelEn: 'Solid' },
      { value: '安妮女王背', labelEn: 'Queen Anne Back' },
      { value: '主轴背', labelEn: 'Spindle' },
    ],
  },
  {
    id: 'careInstruction', label: '护理说明', labelEn: 'Operation Instruction', required: true,
    options: [
      { value: '干洗', labelEn: 'Dry clean' },
      { value: '擦拭干净', labelEn: 'Wipe Clean' },
      { value: '局部清洁', labelEn: 'Spot-clean' },
      { value: '机洗', labelEn: 'Machine Wash' },
    ],
  },
  {
    id: 'reclinerMode', label: '座椅躺椅操作模式', labelEn: 'Seat Recliner Operation Mode', required: true,
    options: [
      { value: '电动', labelEn: 'Electric' },
      { value: '手动', labelEn: 'Manual' },
      { value: '其他', labelEn: 'Other' },
      { value: '不可调节', labelEn: 'Not Adjustable' },
    ],
  },
  {
    id: 'surfaceReco', label: '表面推荐', labelEn: 'Surface Recommendation', required: true, hasInfo: true,
    options: [
      { value: '硬地板', labelEn: 'Hard Floor' },
      { value: '地毯', labelEn: 'Carpet' },
      { value: '其他', labelEn: 'Other' },
    ],
  },
  {
    id: 'upholsteryMaterial', label: '内饰材料', labelEn: 'Upholstery Material', required: true,
    options: [
      { value: '醋酸纤维', labelEn: 'Acetate' },
      { value: '腈纶', labelEn: 'Acrylic' },
      { value: '羊绒', labelEn: 'Cashmere' },
      { value: '青年布', labelEn: 'Chambray' },
      { value: '雪尼尔', labelEn: 'Chenille' },
      { value: '棉', labelEn: 'Cotton' },
      { value: '皮革', labelEn: 'Leather' },
      { value: '天鹅绒', labelEn: 'Velvet' },
    ],
  },
  {
    id: 'powerSupply', label: '供电方式', labelEn: 'Power Supply', required: true,
    options: [
      { value: '无需接电使用', labelEn: 'Use Without Electricity', hasInfo: true },
      { value: '插头供电', labelEn: 'Plug Powered', hasInfo: true },
      { value: '太阳能充电', labelEn: 'Solar Charging', hasInfo: true },
      { value: '电池供电（带插头）', labelEn: 'Battery Powered (with Plug)', hasInfo: true },
      { value: '电池供电（无插头）', labelEn: 'Battery Powered (no Plug)', hasInfo: true },
      { value: 'USB供电', labelEn: 'USB Powered', hasInfo: true },
    ],
  },
  {
    id: 'containWood', label: '是否含有木质材料', labelEn: 'Contain Wooden Materials', required: true,
    options: [
      { value: '是', labelEn: 'Yes' },
      { value: '否', labelEn: 'No' },
    ],
  },
  {
    id: 'material', label: '材料', labelEn: 'Material', required: true, mode: 'multiple',
    options: [
      { value: '玻璃', labelEn: 'Glass' },
      { value: '竹', labelEn: 'Bamboo', hasInfo: true },
      { value: '麂皮', labelEn: 'Suede' },
      { value: '金属', labelEn: 'Metal' },
      { value: '塑料', labelEn: 'Plastic' },
      { value: '藤', labelEn: 'Rattan' },
      { value: '木材', labelEn: 'Wood' },
      { value: '布料', labelEn: 'Fabric' },
    ],
  },
  {
    id: 'upholstered', label: '是否软垫家具', labelEn: 'Upholstered Furniture', required: true, hasInfo: true,
    options: [
      { value: '是', labelEn: 'Yes', hasInfo: true },
      { value: '否', labelEn: 'No', hasInfo: true },
    ],
  },
  {
    id: 'color', label: '颜色', labelEn: 'Color', required: true,
    options: [
      { value: '红色', labelEn: 'Red' },
      { value: '黑色', labelEn: 'Black' },
      { value: '金色', labelEn: 'Golden' },
      { value: '香槟色', labelEn: 'Champagne' },
      { value: '黄色', labelEn: 'Yellow' },
      { value: '橙色', labelEn: 'Orange' },
      { value: '灰色', labelEn: 'Gray' },
      { value: '白色', labelEn: 'White' },
      { value: '蓝色', labelEn: 'Blue' },
      { value: '棕色', labelEn: 'Brown' },
      { value: '绿色', labelEn: 'Green' },
    ],
  },
  {
    id: 'assembled', label: '是否可组装', labelEn: 'Assembled or not', required: true,
    options: [
      { value: '是', labelEn: 'Yes' },
      { value: '否', labelEn: 'No' },
    ],
  },
  {
    id: 'finishType', label: '完成类型', labelEn: 'Finish Type', required: false,
    options: [
      { value: '涂漆', labelEn: 'Painted' },
      { value: '抛光', labelEn: 'Polished' },
      { value: '上漆', labelEn: 'Varnished' },
      { value: '拉丝', labelEn: 'Brushed' },
      { value: '油擦', labelEn: 'Oil rubbed' },
      { value: '电镀', labelEn: 'Plating' },
    ],
  },
  {
    id: 'frameFinish', label: '框架完成', labelEn: 'Frame Finish', required: false,
    options: [
      { value: '枯木', labelEn: 'Alder' },
      { value: '灰', labelEn: 'Ash' },
      { value: '山毛榉', labelEn: 'Beech' },
      { value: '桦木', labelEn: 'Birch wood' },
      { value: '黑色', labelEn: 'Black' },
      { value: '黄铜', labelEn: 'Brass' },
    ],
  },
  {
    id: 'frameMaterial', label: '框架材质', labelEn: 'Frame Material', required: false,
    options: [
      { value: '不锈钢', labelEn: 'Stainless Steel' },
      { value: '铝材', labelEn: 'Aluminum' },
      { value: '青铜', labelEn: 'Bronze' },
      { value: '碳钢', labelEn: 'Carbon Steel' },
      { value: '聚氯乙烯', labelEn: 'Polyvinyl chloride' },
      { value: '榉木', labelEn: 'Beechwood' },
    ],
  },
  {
    id: 'recommendedScenario', label: '推荐使用', labelEn: 'Recommended Scenario', required: false,
    options: [
      { value: '办公室', labelEn: 'Office' },
      { value: '阅读', labelEn: 'Reading' },
      { value: '睡觉', labelEn: 'Sleeping' },
      { value: '露营', labelEn: 'Camping' },
      { value: '起草', labelEn: 'Drafting' },
      { value: '餐饮', labelEn: 'Dining' },
    ],
  },
  {
    id: 'brand', label: '品牌名', labelEn: 'Brand', required: false, special: 'brand', options: [],
  },
  {
    id: 'batteryProperties', label: '电池属性', labelEn: 'Battery Properties', required: false,
    options: [
      { value: '可充电电池', labelEn: 'Rechargeable Battery', hasInfo: true },
      { value: '不可充电电池', labelEn: 'Non-rechargeable Battery', hasInfo: true },
      { value: '太阳能电池', labelEn: 'Solar Battery', hasInfo: true },
      { value: '不带电池', labelEn: 'Without Battery', hasInfo: true },
    ],
  },
]

// AI 建议填写内容（针对客厅单人椅）
const AI_FILL_ATTRS: { id: string; value: string | string[] }[] = [
  { id: 'feature', value: '人体工程学' },
  { id: 'fillingMaterial', value: '聚酯' },
  { id: 'backStyle', value: '实心背' },
  { id: 'careInstruction', value: '擦拭干净' },
  { id: 'reclinerMode', value: '手动' },
  { id: 'surfaceReco', value: '硬地板' },
  { id: 'upholsteryMaterial', value: '棉' },
  { id: 'powerSupply', value: '无需接电使用' },
  { id: 'containWood', value: '是' },
  { id: 'material', value: ['金属', '木材', '布料'] },
  { id: 'upholstered', value: '是' },
  { id: 'color', value: '灰色' },
  { id: 'assembled', value: '是' },
  { id: 'finishType', value: '涂漆' },
  { id: 'frameMaterial', value: '不锈钢' },
]

// ==================== 主组件 ====================
type LogMsg = { text: string; loading?: boolean; done?: boolean }
type Phase = 'idle' | 'running' | 'done'

export default function ProductAttributesSection() {
  const [values, setValues] = useState<Record<string, string | string[]>>({})
  const [phase, setPhase] = useState<Phase>('idle')
  const [analyzerMsgs, setAnalyzerMsgs] = useState<LogMsg[]>([])
  const [executorMsgs, setExecutorMsgs] = useState<LogMsg[]>([])
  const [highlightId, setHighlightId] = useState<string>('')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  const startAI = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setValues({})
    setAnalyzerMsgs([])
    setExecutorMsgs([])
    setHighlightId('')
    setPhase('running')

    let elapsed = 0
    function schedule(fn: () => void, delay: number) {
      elapsed += delay
      const t = setTimeout(fn, elapsed)
      timers.current.push(t)
    }

    const appendAnalyzer = (msg: LogMsg) =>
      setAnalyzerMsgs(prev => [...prev, msg])
    const updateAnalyzer = (update: Partial<LogMsg>) =>
      setAnalyzerMsgs(prev => {
        if (!prev.length) return prev
        const next = [...prev]
        next[next.length - 1] = { ...next[next.length - 1], ...update }
        return next
      })
    const appendExecutor = (msg: LogMsg) =>
      setExecutorMsgs(prev => [...prev, msg])
    const updateExecutor = (update: Partial<LogMsg>) =>
      setExecutorMsgs(prev => {
        if (!prev.length) return prev
        const next = [...prev]
        next[next.length - 1] = { ...next[next.length - 1], ...update }
        return next
      })

    // ── 分析员：分析图片阶段 ──
    schedule(() => appendAnalyzer({ text: '正在读取商品图片（5张）...', loading: true }), 300)
    schedule(() => updateAnalyzer({ loading: false, done: true, text: '图片读取完成（5张）' }), 1400)
    schedule(() => appendAnalyzer({ text: '商品类型：客厅单人椅', done: true }), 400)
    schedule(() => appendAnalyzer({ text: '主色调：灰色系', done: true }), 350)
    schedule(() => appendAnalyzer({ text: '结构：布艺软垫 + 金属框架', done: true }), 350)
    schedule(() => appendAnalyzer({ text: `制定填写计划（${AI_FILL_ATTRS.length} 项属性）`, done: true }), 500)
    schedule(() => appendAnalyzer({ text: '已发送任务至执行者 →', done: true }), 400)

    // ── 执行者：接收任务 ──
    schedule(() => appendExecutor({ text: '收到分析结果，开始执行...', done: true }), 200)

    // ── 执行者：逐个填写 ──
    for (let i = 0; i < AI_FILL_ATTRS.length; i++) {
      const { id, value } = AI_FILL_ATTRS[i]
      const attr = ATTRS.find(a => a.id === id)!
      const valStr = Array.isArray(value) ? value.join('、') : value
      schedule(() => {
        setHighlightId(id)
        appendExecutor({ text: `填写：${attr.label}...`, loading: true })
      }, i === 0 ? 100 : 150)
      schedule(() => {
        setValues(prev => ({ ...prev, [id]: value }))
        setHighlightId('')
        updateExecutor({ loading: false, done: true, text: `${attr.label} → ${valStr}` })
      }, 700)
    }

    // ── 分析员：核查阶段 ──
    schedule(() => appendAnalyzer({ text: '核查填写结果...', loading: true }), 600)
    schedule(() => updateAnalyzer({
      loading: false, done: true,
      text: `核查通过，已填写 ${AI_FILL_ATTRS.length}/${ATTRS.length} 项`,
    }), 1500)

    // ── 执行者：完成 ──
    schedule(() => {
      appendExecutor({ text: '所有任务已完成 ✓', done: true })
      setPhase('done')
    }, 300)
  }, [])

  // 属性填写率
  const filledCount = ATTRS.filter(a => {
    const v = values[a.id]
    return Array.isArray(v) ? v.length > 0 : !!v
  }).length
  const fillPct = Math.round(filledCount / ATTRS.length * 100)
  const fillLabel = fillPct < 40 ? '低' : fillPct < 70 ? '中' : '高'
  const fillColor = fillPct < 40 ? '#ff4d4f' : fillPct < 70 ? '#faad14' : GREEN

  return (
    <div>
      {/* 警告横幅 */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        background: '#fffbe6', border: '1px solid #ffe58f',
        borderRadius: 4, padding: '10px 14px', marginBottom: 16, fontSize: 12,
      }}>
        <ExclamationCircleFilled style={{ color: '#faad14', marginTop: 1, flexShrink: 0 }} />
        <span style={{ color: '#613400' }}>
          请如实填写商品属性信息，如出现描述不符等违规情形，平台方有权依据商家协议及商家规则规定采取包括不限于商品下架、禁售等处理措施。
        </span>
      </div>

      {/* 属性填写率 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#262626' }}>属性填写率</span>
        <span style={{ color: '#8c8c8c', fontSize: 12 }}>({filledCount}/{ATTRS.length})</span>
        <div style={{ flex: 1, maxWidth: 200 }}>
          <Progress percent={fillPct} showInfo={false} strokeColor={fillColor} size="small" />
        </div>
        <span style={{ color: fillColor, fontSize: 12, fontWeight: 500 }}>{fillLabel}</span>
      </div>
      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 20 }}>
        完整并准确地填写属性有利于商品在搜索和推荐中露出
      </div>

      {/* AI 填写按钮 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Button
          icon={<RobotOutlined />}
          type="primary"
          ghost
          onClick={startAI}
          disabled={phase === 'running'}
          style={{ fontSize: 13 }}
        >
          {phase === 'running' ? 'AI 分析中...' : 'AI 智能填写属性'}
        </Button>
        {phase === 'done' && (
          <Button type="link" onClick={startAI} style={{ fontSize: 12, padding: 0 }}>
            重新分析
          </Button>
        )}
      </div>

      {/* 双 Agent 面板 */}
      {phase !== 'idle' && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid #e8e8e8', borderRadius: 6,
          overflow: 'hidden', marginBottom: 24,
          maxHeight: 260, minHeight: 120,
        }}>
          {/* 分析员 */}
          <div style={{
            padding: '12px 14px',
            borderRight: '1px solid #e8e8e8',
            background: '#f6ffed',
            overflowY: 'auto',
          }}>
            <div style={{
              fontWeight: 600, fontSize: 12, color: '#389e0d',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              🧠 分析员
              <span style={{ fontWeight: 400, color: '#8c8c8c', fontSize: 11 }}>
                分析图片 · 安排任务 · 核查结果
              </span>
            </div>
            {analyzerMsgs.map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 12 }}>
                {msg.loading
                  ? <LoadingOutlined style={{ color: BLUE, fontSize: 11, flexShrink: 0 }} />
                  : <CheckCircleFilled style={{ color: GREEN, fontSize: 11, flexShrink: 0 }} />
                }
                <span style={{ color: '#333' }}>{msg.text}</span>
              </div>
            ))}
          </div>

          {/* 执行者 */}
          <div style={{
            padding: '12px 14px',
            background: '#f0f5ff',
            overflowY: 'auto',
          }}>
            <div style={{
              fontWeight: 600, fontSize: 12, color: BLUE,
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ⚡ 执行者
              <span style={{ fontWeight: 400, color: '#8c8c8c', fontSize: 11 }}>
                填写属性字段
              </span>
            </div>
            {executorMsgs.map((msg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 12 }}>
                {msg.loading
                  ? <LoadingOutlined style={{ color: BLUE, fontSize: 11, flexShrink: 0 }} />
                  : <CheckCircleFilled style={{ color: GREEN, fontSize: 11, flexShrink: 0 }} />
                }
                <span style={{ color: '#333' }}>{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 属性网格（3列）*/}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 32px' }}>
        {ATTRS.map(attr => {
          const isHighlight = highlightId === attr.id
          const val = values[attr.id]
          return (
            <div
              key={attr.id}
              style={{
                outline: isHighlight ? `2px solid ${BLUE}` : 'none',
                borderRadius: 4,
                transition: 'outline 0.15s',
                padding: isHighlight ? '4px' : 0,
              }}
            >
              {/* 字段标签行 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: '#262626' }}>
                  {attr.required && <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>}
                  <span>{attr.label}</span>
                  {' '}
                  <span style={{ color: '#8c8c8c', fontSize: 11 }}>{attr.labelEn}</span>
                  {attr.hasInfo && (
                    <Tooltip title="查看说明">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', fontSize: 12, cursor: 'pointer' }} />
                    </Tooltip>
                  )}
                </div>
                {attr.special === 'brand' && (
                  <span style={{ fontSize: 11, color: '#8c8c8c' }}>
                    若未找到商标，可<a href="#" style={{ color: BLUE }}>新增商标资质</a>
                  </span>
                )}
              </div>

              {/* 下拉输入 */}
              <Select
                style={{ width: '100%' }}
                placeholder="请选择"
                mode={attr.mode as 'multiple' | undefined}
                value={val as string | string[] | undefined}
                onChange={v => setValues(prev => ({ ...prev, [attr.id]: v }))}
                options={attr.options.map(opt => ({
                  value: opt.value,
                  label: `${opt.value} ${opt.labelEn}`,
                }))}
                notFoundContent={null}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
