'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { InfoCircleFilled, UserOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Radio, Select, Input, Checkbox, Button, Modal } from 'antd'

// 协议内容
const AGREEMENT_CONTENT = {
  enhanced: {
    title: '新商孵化方案（增强版）',
    content: `1、自动化大促报名：

1.1 报名活动范围：包含不限于S级/A+级别大促入围活动及外围活动，核心频道玩法（如SuperDeals、百亿补贴等），并有机会享受全链路大促氛围打标、大促平台Code权益；增强版额外覆盖核心场域自动化报名：Super Deals（含brand+场域）、N元N件活动等，以及营销工具自动化加入：新品闪电推服务、营销智投计划等；

1.2 最低折扣率要求：商品报名时将以符合每个具体活动要求门槛的最低折扣率报名，折扣率数值非固定值，以具体的活动报名要求为准。参考2024年大促最低折扣率要求，折扣率集中在30/90天最低价+"3%~12%"off，个别大促折扣率在30/90天最低价+"8%~18%"off；您可以登录跨境商家工作台【平台活动】-【大促自动化报名计划】-【已报名活动】查看平台代报名的活动明细，进入对应活动报名商品列表页面；

1.3 退出规则：为保障商家活动商品经营的延续性，通过自动化报名的商品如商家退出平台经营、商品原材料上涨、商品停供（缺货），等客观原因在商家提供相关证明材料后，经过平台审核准予退出活动，其他场景原则上不予以支持退出活动。

2、自动开启智能营销工具：

2.1 智能营销工具范围：包含不限于店铺上新通知、高潜客户速卖通活动通知、咨询客户催下单（即时）、自动催单催付、下单未付款客户催付等，以助力提升商品转化；您可以登录跨境商家工作台【营销】-【智能营销】专区管理和维护相关场景和功能；

2.2 退出规则：商家可自行至智能营销页面，点击申请关闭所有智能营销工具功能，暂不支持关闭单个功能。

3、基础孵化服务费：增强版基础孵化服务费率为0%（活动期间），平台将按照实际协议费率收取基础孵化服务费，更多细则请参考《全球速卖通新商家孵化基础服务费规则》。

4、协议效期：自商家选择新商孵化方案后的180天持续有效，但商家在180天内更换新商孵化方案的除外。在180天期间内商家只能选择更换新商孵化方案，而不能退出所有新商孵化方案。商家不更换新商孵化方案的，可于期间届满前7天通知速卖通终止本协议，后续速卖通将不再于期间届满后继续提供基础服务给商家，如商家未提前通知终止，则本服务自动顺延，顺延次数不限。`,
  },
  standard: {
    title: '新商孵化方案（标准版）',
    content: `1、自动化大促报名：

1.1 报名活动范围：包含不限于S级/A+级别大促入围活动及外围活动，核心频道玩法（如SuperDeals、百亿补贴等），并有机会享受全链路大促氛围打标、大促平台Code权益；

1.2 最低折扣率要求：商品报名时将以符合每个具体活动要求门槛的最低折扣率报名，折扣率数值非固定值，以具体的活动报名要求为准。参考2024年大促最低折扣率要求，折扣率集中在30/90天最低价+"3%~12%"off，个别大促折扣率在30/90天最低价+"8%~18%"off；您可以登录跨境商家工作台【平台活动】-【大促自动化报名计划】-【已报名活动】查看平台代报名的活动明细，进入对应活动报名商品列表页面；

1.3 退出规则：为保障商家活动商品经营的延续性，通过自动化报名的商品如商家退出平台经营、商品原材料上涨、商品停供（缺货），等客观原因在商家提供相关证明材料后，经过平台审核准予退出活动，其他场景原则上不予以支持退出活动。

2、自动开启智能营销工具：

2.1 智能营销工具范围：包含不限于店铺上新通知、高潜客户速卖通活动通知、咨询客户催下单（即时）、自动催单催付、下单未付款客户催付等，以助力提升商品转化；您可以登录跨境商家工作台【营销】-【智能营销】专区管理和维护相关场景和功能

2.2 退出规则：商家可自行至智能营销页面，点击申请关闭所有智能营销工具功能，暂不支持关闭单个功能。

3、基础孵化服务费：平台将按照商品成交金额的2%收取基础孵化服务费，更多细则请参考《全球速卖通新商家孵化基础服务费规则》。

4、协议效期：自商家选择新商孵化方案后的180天持续有效，但商家在180天内更换新商孵化方案的除外。在180天期间内商家只能选择更换新商孵化方案，而不能退出所有新商孵化方案。商家不更换新商孵化方案的，可于期间届满前7天通知速卖通终止本协议，后续速卖通将不再于期间届满后继续提供基础服务给商家，如商家未提前通知终止，则本服务自动顺延，顺延次数不限。`,
  },
}

const INDUSTRY_OPTIONS = [
  { value: '1', label: '制造或销售车辆、飞机或其他运输设备（包括零件和配件）' },
  { value: '2', label: '船舶、油轮或船只的制造、修理或销售' },
  { value: '3', label: '制造或销售飞机设备和用品（包括零件和配件）' },
  { value: '4', label: '家庭和花园' },
  { value: '5', label: '美容与健康' },
  { value: '6', label: '体育和娱乐' },
  { value: '7', label: '玩具和爱好' },
  { value: '8', label: '消费类电子产品' },
  { value: '9', label: '服装、时装和珠宝' },
  { value: '10', label: '食品和饮料' },
  { value: '11', label: '健康和医疗设备' },
  { value: '12', label: '农业和园艺' },
  { value: '13', label: '建筑材料和工具' },
  { value: '14', label: '办公用品和文具' },
  { value: '15', label: '宠物用品' },
  { value: '16', label: '汽车配件和工具' },
  { value: '17', label: '工业设备和机械' },
  { value: '18', label: '其他' },
]

const AGREEMENTS_1 = [
  { text: '《中国卖家个人信息跨境传输同意函》', blue: true },
]

const AGREEMENTS_2 = [
  '《跨境商家统一工作台服务协议》',
  '《全球速卖通中国卖家隐私政策》',
  '《全球速卖通免费会员协议》',
  '《卖家遵守适用规则承诺书》',
  '《交易服务协议》',
  '《AliExpress.com 使用条款》',
  '《速卖通生产者延伸责任相关服务协议》',
  '《速卖通商户服务协议》',
  '《支付宝服务协议》',
  '《支付宝 MS 条款和条件》',
  '《速卖通供应链综合服务协议-配送》',
  '《全球速卖通海外本地退货服务框架协议》',
  '《"海外本地退货"技术服务协议》',
  '《目的国税费代缴（DDP）服务框架协议》',
  '《物品安全保障承诺函》',
  '《经济制裁和出口管制合规承诺函》',
  '《跨店铺预约交货技术服务协议》',
]

export default function UBOPage() {
  const router = useRouter()
  const [hasUBO, setHasUBO] = useState<'yes' | 'no'>('no')
  const [agreed1, setAgreed1] = useState(false)
  const [agreed2, setAgreed2] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'enhanced' | 'standard' | null>(null)
  const [modalPlan, setModalPlan] = useState<'enhanced' | 'standard' | null>(null)

  const openAgreement = (e: React.MouseEvent, plan: 'enhanced' | 'standard') => {
    e.stopPropagation()
    setModalPlan(plan)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff', paddingBottom: 72 }}>

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
              {/* AliExpress logo 简化 */}
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

          {/* 右侧店铺名 */}
          <span className="text-sm text-gray-600 ml-2">AliExpress Store</span>

          {/* 头像 */}
          <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ backgroundColor: '#ff4d4f' }}>
            <UserOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="px-6 py-6" style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* 主体 */}
        <div>

          {/* 页面标题 */}
          <h1 className="font-bold mb-5" style={{ fontSize: 20, color: '#1a1a2e' }}>资金账户UBO信息</h1>

          {/* 蓝色提示框 */}
          <div className="flex items-start gap-2 rounded px-4 py-3 mb-8"
            style={{ backgroundColor: '#E6F4FF', border: '1px solid #91CAFF' }}>
            <InfoCircleFilled style={{ color: '#1677ff', fontSize: 14, marginTop: 2, flexShrink: 0 }} />
            <p className="text-sm" style={{ color: '#333', lineHeight: 1.7 }}>
              根据审核通过的企业信息在第三方平台信息查询自动填写部分最终受益人信息，请根据最新信息补充/修改。
            </p>
          </div>

          {/* 企业受益人信息（UBO） */}
          <section className="mb-6">
            <h2 className="font-semibold mb-4" style={{ fontSize: 15, color: '#1a1a2e' }}>企业受益人信息（UBO）</h2>
            <div className="mb-4">
              <p className="text-sm mb-3" style={{ color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>
                当前企业是否存在持股比例不少于25%的企业受益人？
              </p>
              <Radio.Group value={hasUBO} onChange={e => setHasUBO(e.target.value)}>
                <Radio value="yes">是</Radio>
                <Radio value="no">否</Radio>
              </Radio.Group>
            </div>
          </section>

          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

          {/* 其他信息 */}
          <section className="mb-6">
            <h2 className="font-semibold mb-5" style={{ fontSize: 15, color: '#1a1a2e' }}>其他信息</h2>

            {/* 行业类型 */}
            <div className="mb-5">
              <label className="block text-sm mb-2" style={{ color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>行业类型
              </label>
              <Select
                size="large"
                placeholder="请选择行业类型"
                style={{ width: 300 }}
                options={INDUSTRY_OPTIONS}
              />
            </div>

            {/* 企业联系电话 */}
            <div className="mb-5">
              <label className="block text-sm mb-2" style={{ color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>企业联系电话
              </label>
              <Input size="large" placeholder="请输入" style={{ width: 300 }} />
            </div>
          </section>

          {/* 协议1 */}
          <div className="mb-2">
            <Checkbox checked={agreed1} onChange={e => setAgreed1(e.target.checked)}>
              <span className="text-sm" style={{ color: '#262626' }}>
                我已阅读并同意{' '}
                <span style={{ color: '#1677ff', cursor: 'pointer' }}>《中国卖家个人信息跨境传输同意函》</span>
              </span>
            </Checkbox>
          </div>

          {/* 协议2 */}
          <div className="mb-6">
            <Checkbox checked={agreed2} onChange={e => setAgreed2(e.target.checked)}>
              <span className="text-sm leading-relaxed" style={{ color: '#262626' }}>
                我已阅读并同意{' '}
                {AGREEMENTS_2.map((text, i) => (
                  <span key={i}>
                    <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>
                    {i < AGREEMENTS_2.length - 1 ? '　' : ''}
                  </span>
                ))}
              </span>
            </Checkbox>
          </div>

          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

          {/* 孵化方案 */}
          <section>
            <p className="text-sm mb-4" style={{ color: '#595959' }}>
              平台提供新商孵化服务，请选择其中一种服务并签约对应的协议
            </p>

            <div className="flex gap-4">
              {/* 增强版 */}
              <div
                className="flex-1 rounded-lg p-5 cursor-pointer"
                style={{
                  border: selectedPlan === 'enhanced' ? '2px solid #1677ff' : '1px solid #5B9CF5',
                  backgroundColor: selectedPlan === 'enhanced' ? '#E6F4FF' : '#F0F7FF',
                }}
                onClick={() => setSelectedPlan('enhanced')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Radio checked={selectedPlan === 'enhanced'} onChange={() => setSelectedPlan('enhanced')} />
                  <span className="font-semibold" style={{ fontSize: 14, color: '#1a1a2e' }}>新商孵化方案（增强版）</span>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#1677ff', color: '#fff', fontSize: 11 }}>推荐</span>
                </div>
                <ul className="space-y-1.5 mb-4" style={{ paddingLeft: 4 }}>
                  <li className="text-sm flex items-start gap-1.5" style={{ color: '#262626' }}>
                    <span style={{ color: '#595959', flexShrink: 0, marginTop: 2 }}>●</span>
                    基础孵化服务费率：<s style={{ color: '#8c8c8c' }}>2%</s>
                    <span style={{ color: '#1677ff', fontWeight: 600 }}> 0%</span>
                  </li>
                  <li className="text-sm flex items-start gap-1.5" style={{ color: '#262626' }}>
                    <span style={{ color: '#595959', flexShrink: 0, marginTop: 2 }}>●</span>
                    服务范围更广
                  </li>
                  <li className="text-sm flex items-start gap-1.5 ml-4" style={{ color: '#595959' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>●</span>
                    大促自动化报名：S级及A+级大促，覆盖入围及外围活动
                  </li>
                  <li className="text-sm flex items-start gap-1.5 ml-4" style={{ color: '#595959' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>●</span>
                    客户营销工具：店铺上新通知、自动催单催付等
                  </li>
                  <li className="text-sm flex items-start gap-1.5 ml-4" style={{ color: '#595959' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>●</span>
                    核心场域自动化报名：Super Deals（含brand+场域）、N元N件活动等
                  </li>
                  <li className="text-sm flex items-start gap-1.5 ml-4" style={{ color: '#595959' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>●</span>
                    营销工具自动化加入：新品闪电推服务、营销智投计划等
                  </li>
                </ul>
                <p className="text-sm" style={{ color: '#8c8c8c' }}>
                  我已阅读并同意{' '}
                  <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={e => openAgreement(e, 'enhanced')}>《速卖通新商家基础孵化服务协议（增强版）》</span>
                </p>
              </div>

              {/* 标准版 */}
              <div
                className="flex-1 rounded-lg p-5 cursor-pointer"
                style={{
                  border: selectedPlan === 'standard' ? '2px solid #1677ff' : '1px solid #5B9CF5',
                  backgroundColor: selectedPlan === 'standard' ? '#E6F4FF' : '#F0F7FF',
                }}
                onClick={() => setSelectedPlan('standard')}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Radio checked={selectedPlan === 'standard'} onChange={() => setSelectedPlan('standard')} />
                  <span className="font-semibold" style={{ fontSize: 14, color: '#1a1a2e' }}>新商孵化方案（标准版）</span>
                </div>
                <ul className="space-y-1.5 mb-4" style={{ paddingLeft: 4 }}>
                  <li className="text-sm flex items-start gap-1.5" style={{ color: '#262626' }}>
                    <span style={{ color: '#595959', flexShrink: 0, marginTop: 2 }}>●</span>
                    基础孵化服务费率：<span style={{ color: '#ff4d4f' }}>2%</span>
                  </li>
                  <li className="text-sm flex items-start gap-1.5" style={{ color: '#595959' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>●</span>
                    大促自动化报名：S级及A+级活动，覆盖入围及外围活动
                  </li>
                  <li className="text-sm flex items-start gap-1.5" style={{ color: '#595959' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>●</span>
                    客户营销工具：店铺上新通知、自动催单催付等
                  </li>
                </ul>
                <p className="text-sm" style={{ color: '#8c8c8c' }}>
                  我已阅读并同意{' '}
                  <span style={{ color: '#1677ff', cursor: 'pointer' }} onClick={e => openAgreement(e, 'standard')}>《速卖通新商家基础孵化服务协议（标准版）》</span>
                </p>
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* FAQ - fixed 定位，不影响主体宽度 */}
      <div className="fixed bg-white rounded-xl p-5"
        style={{ right: 24, top: 80, width: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 className="font-semibold mb-3" style={{ fontSize: 14, color: '#1a1a2e' }}>FAQ</h3>
        <p className="text-sm cursor-pointer" style={{ color: '#1677ff' }}>· AE店铺激活常见问题</p>
      </div>

      {/* 协议弹窗 */}
      <Modal
        open={!!modalPlan}
        onCancel={() => setModalPlan(null)}
        title={modalPlan ? AGREEMENT_CONTENT[modalPlan].title : ''}
        footer={
          <Button onClick={() => setModalPlan(null)}>关闭</Button>
        }
        width={600}
        styles={{ body: { maxHeight: 480, overflowY: 'auto' } }}
      >
        {modalPlan && (
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#333' }}>
            {AGREEMENT_CONTENT[modalPlan].content}
          </div>
        )}
      </Modal>

      {/* 底部固定工具栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between px-6"
        style={{ height: 56, borderTop: '1px solid #e8e8e8', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <Button size="large" style={{ minWidth: 72 }} onClick={() => router.back()}>返回</Button>
        <div className="flex gap-3">
          <Button size="large" style={{ minWidth: 72 }}>保存</Button>
          <Button type="primary" size="large" style={{ minWidth: 72, backgroundColor: '#1677ff' }}>提交</Button>
        </div>
      </div>
    </div>
  )
}
