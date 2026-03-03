'use client'

import { useState, useEffect } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import ProductsClient from './ProductsClient'

const AGREEMENTS = [
  {
    key: 'cs',
    title: '客户服务解决方案合作协议',
    subtitle: '协议签署后，您可随时在【客服中心-CSBS】使用该功能。',
    content: `客户服务解决方案合作协议
（V1.1版本）

本《客户服务解决方案合作协议》（以下简称"本协议"）是由客户服务解决方案提供方（定义附件，以下简称"甲方"或"我们"）与使用本协议项下客户服务解决方案的商家（以下简称"乙方"或"您"）就乙方委托甲方提供客户服务解决方案相关事项达成的协议。

甲方在此特别提醒乙方认真阅读、充分理解本协议各项内容，并请审慎考虑选择是否签署本协议。如您接受本协议（包括但不限于通过点击"我已阅读并同意"按钮确认接受本协议），前述按钮的语言及表述可能会调整，以Temu商家中心页面显示为准）或继续使用客户服务解决方案的，则视为您已充分阅读、理解并且同意本协议的全部内容的接受。您进一步确认，通过点击"我已阅读并同意"按钮，您确认已被提醒且您知悉本协议中以加粗字体显示的全部内容及条款，并且在无提上述的画面下，您已充分阅读、理解并同意接受该加粗字体显示的全部内容及条款约束。

以上条款为本协议正文的组成部分。

1. 协议构成及变更
1.1 协议构成。本协议包括协议正文及附件，并包括所有甲方已经发布的或将来可能发布的各类与本协议相关的服务规则、规范须知、政策、实施细则、通知、公告等（以下合称"服务规则"）。所有附件和服务规则均为本协议的有效组成部分，与协议正文具有同等法律效力。协议正文、附件或服务规则之间存在冲突，以发布在后的文件为准行。

1.2 协议变更及生效。乙方可不时因政策变动、功能变动、反欺诈及业务需要等原因变更（包括但不限于修订、增加、废止、重述）本协议正文、附件及/或服务规则（变更后按协议下称"修订条款"），并以在Temu商家中心页面公示发布的形式通知您。如您在修订条款中记载的发布日期后继续使用本协议项下所述的客户服务解决方案或通过点击"我已阅读并同意"按钮确认（前述按钮的语言及表述可能会调整，以Temu商家中心页面显示为准），则表示您接受该修订条款。如您不同意修订条款，您将被视为已决定不再使用客户服务解决方案，并按照本协议第5.1条的约定终止本协议。除前述规定外，本协议的任何变更均以以书面形式并经双方（或其授权代表）签署，否则无效。

2. 客户服务解决方案及费用结算
2.1 客户服务解决方案。乙方可根据自身业务需求，自主选择是否授权甲方、甲方关联公司及 或甲方整合的第三方服务商为乙方店铺提供客户服务解决方案，包括授权甲方、甲方关联公司及 或甲方整合的第三方服务商帮助乙方处理买家的各类咨询与投诉（又称"本方案"）。为免疑义，乙方选择使用本方案的，仍有权依据本协议第5.1条的规定终止本协议并自行处理其店铺的客服事宜。`,
  },
  {
    key: 'shipping',
    title: '运输标签服务条款',
    subtitle: '',
    content: `运输标签服务条款

本运输标签服务条款（以下简称"本条款"）规定了您使用Temu运输标签服务的相关权利和义务。

1. 服务说明
Temu运输标签服务是指平台为商家提供的物流面单打印及管理服务，帮助商家更便捷地完成订单发货操作。

2. 使用规则
2.1 商家须按照平台规定的格式和标准使用运输标签。
2.2 商家不得伪造、篡改或滥用运输标签。
2.3 运输标签仅限于平台订单使用，不得用于其他用途。

3. 费用说明
使用本服务产生的相关费用将按照平台公示的标准收取，并从商家账户中扣除。`,
  },
]

export default function ProductsPageWrapper() {
  const [showModal, setShowModal] = useState(false)
  const [activeKey, setActiveKey] = useState('cs')

  useEffect(() => {
    // 只弹一次，用 localStorage 记录
    const agreed = localStorage.getItem('temuAgreementSigned')
    if (!agreed) {
      setShowModal(true)
    }
  }, [])

  const handleAgree = () => {
    localStorage.setItem('temuAgreementSigned', '1')
    setShowModal(false)
  }

  const handleSkip = () => {
    setShowModal(false)
  }

  const active = AGREEMENTS.find(a => a.key === activeKey) || AGREEMENTS[0]

  return (
    <MainLayout>
      <ProductsClient />

      {/* 协议弹窗 */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          backgroundColor: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: 8,
            width: 760, maxHeight: '82vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            {/* 标题栏 */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>
                当前您尚未确认以下协议，请及时确认并签署
              </span>
              <span
                onClick={handleSkip}
                style={{ fontSize: 18, color: '#8c8c8c', cursor: 'pointer', lineHeight: 1 }}
              >✕</span>
            </div>

            {/* 内容区：左侧列表 + 右侧正文 */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* 左侧协议列表 */}
              <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
                {AGREEMENTS.map(a => (
                  <div
                    key={a.key}
                    onClick={() => setActiveKey(a.key)}
                    style={{
                      padding: '14px 16px',
                      cursor: 'pointer',
                      borderLeft: activeKey === a.key ? '3px solid #1677ff' : '3px solid transparent',
                      backgroundColor: activeKey === a.key ? '#f0f6ff' : 'white',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500, color: activeKey === a.key ? '#1677ff' : '#262626', marginBottom: a.subtitle ? 4 : 0 }}>
                      {a.title}
                    </div>
                    {a.subtitle && (
                      <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: 1.5 }}>
                        {a.subtitle}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 右侧协议正文 */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#262626', marginBottom: 16, textAlign: 'center' }}>
                  {active.title}
                </div>
                <div style={{ fontSize: 13, color: '#262626', lineHeight: 2, whiteSpace: 'pre-wrap' }}>
                  {active.content}
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex', justifyContent: 'flex-end', gap: 12,
            }}>
              <button
                onClick={handleAgree}
                style={{
                  padding: '8px 24px', border: 'none', borderRadius: 4,
                  backgroundColor: '#1677ff', color: 'white',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
              >
                我已阅读并同意
              </button>
              <button
                onClick={handleSkip}
                style={{
                  padding: '8px 24px', border: '1px solid #d9d9d9', borderRadius: 4,
                  backgroundColor: 'white', color: '#262626',
                  fontSize: 14, cursor: 'pointer',
                }}
              >
                暂不签署
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
