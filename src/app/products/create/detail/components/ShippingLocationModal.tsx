'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { Modal, Input, Checkbox, Button, Alert } from 'antd'

// 发货地选项
const shippingLocationOptions = [
  { label: '日本(JP)', value: 'jp' },
  { label: '加拿大(CA)', value: 'ca' },
  { label: '尼日利亚(NG)', value: 'ng' },
  { label: '南非(ZA)', value: 'za' },
  { label: '中国大陆', value: 'cn' },
  { label: '智利(CL)', value: 'cl' },
  { label: '巴西(BR)', value: 'br' },
  { label: '土耳其(TR)', value: 'tr' },
  { label: '乌克兰(UA)', value: 'ua' },
  { label: '阿联酋(AE)', value: 'ae' },
  { label: '以色列(IL)', value: 'il' },
  { label: '捷克', value: 'cz' },
  { label: '波兰(PL)', value: 'pl' },
  { label: '美国(US)', value: 'us' },
  { label: '英国(UK)', value: 'uk' },
  { label: '德国(DE)', value: 'de' },
  { label: '西班牙(ES)', value: 'es' },
  { label: '澳大利亚(AU)', value: 'au' },
  { label: '俄罗斯(RU)', value: 'ru' },
  { label: '印度尼西亚(ID)', value: 'id' },
  { label: '法国(FR)', value: 'fr' },
  { label: '意大利(IT)', value: 'it' },
  { label: '越南(VN)', value: 'vn' },
  { label: '匈牙利(HU)', value: 'hu' },
  { label: '拉脱维亚(LV)', value: 'lv' },
  { label: '沙特阿拉伯(SA)', value: 'sa' },
  { label: '比利时(BE)', value: 'be' },
  { label: '韩国(KR)', value: 'kr' },
]

interface ShippingLocationModalProps {
  open: boolean
  onClose: () => void
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
}

function ShippingLocationModal({
  open,
  onClose,
  selectedValues,
  onSelectionChange,
}: ShippingLocationModalProps) {
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() =>
    shippingLocationOptions.filter(opt => !search || opt.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectionChange(shippingLocationOptions.map(opt => opt.value))
    } else {
      onSelectionChange([])
    }
  }, [onSelectionChange])

  const handleOptionChange = useCallback((value: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedValues, value])
    } else {
      onSelectionChange(selectedValues.filter(v => v !== value))
    }
  }, [selectedValues, onSelectionChange])

  const handleClose = useCallback(() => {
    setSearch('')
    onClose()
  }, [onClose])

  return (
    <Modal
      title="请选择"
      open={open}
      onCancel={handleClose}
      width={1200}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleClose}>
            确定
          </Button>
        </div>
      }
    >
      <div style={{ padding: '20px 0' }}>
        <Alert
          description={
            <span>
              中国大陆发货地不可和非中国大陆发货地同时勾选，具体可点击《
              <a href="#" style={{ color: '#1677ff' }}>全球速卖通商品发货地属性变更规则</a>
              》
            </span>
          }
          type="info"
          showIcon
          closable
          style={{ marginBottom: 20 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Input
              placeholder="搜索"
              prefix={<span>🔍</span>}
              style={{ width: 400 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Checkbox
              checked={selectedValues.length === shippingLocationOptions.length}
              indeterminate={selectedValues.length > 0 && selectedValues.length < shippingLocationOptions.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          <div style={{ color: '#8C8C8C' }}>已选{selectedValues.length}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 20px' }}>
          {filteredOptions.map(opt => (
            <Checkbox
              key={opt.value}
              checked={selectedValues.includes(opt.value)}
              onChange={(e) => handleOptionChange(opt.value, e.target.checked)}
            >
              {opt.label}
            </Checkbox>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default memo(ShippingLocationModal)
