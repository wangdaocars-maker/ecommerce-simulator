'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { Modal, Input, Checkbox, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export interface SelectionOption {
  label: string
  value: string
}

interface SelectionModalProps {
  title?: string
  open: boolean
  onClose: () => void
  options: SelectionOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  width?: number
}

function SelectionModal({
  title = '请选择',
  open,
  onClose,
  options,
  selectedValues,
  onSelectionChange,
  width = 800,
}: SelectionModalProps) {
  const [search, setSearch] = useState('')

  // 缓存过滤后的选项
  const filteredOptions = useMemo(() =>
    options.filter(opt => !search || opt.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  )

  // 处理全选
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectionChange(options.map(opt => opt.value))
    } else {
      onSelectionChange([])
    }
  }, [options, onSelectionChange])

  // 处理单个选项变化
  const handleOptionChange = useCallback((value: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedValues, value])
    } else {
      onSelectionChange(selectedValues.filter(v => v !== value))
    }
  }, [selectedValues, onSelectionChange])

  // 关闭时重置搜索
  const handleClose = useCallback(() => {
    setSearch('')
    onClose()
  }, [onClose])

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      width={width}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          取消
        </Button>,
        <Button key="confirm" type="primary" onClick={handleClose}>
          确定
        </Button>
      ]}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="搜索"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Checkbox
            checked={selectedValues.length === options.length && options.length > 0}
            indeterminate={selectedValues.length > 0 && selectedValues.length < options.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
            style={{ marginBottom: 16 }}
          >
            全选
          </Checkbox>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
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
        <div style={{ width: 100, textAlign: 'right', color: '#8C8C8C' }}>
          已选{selectedValues.length}
        </div>
      </div>
    </Modal>
  )
}

export default memo(SelectionModal)
