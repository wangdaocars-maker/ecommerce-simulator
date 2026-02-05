'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { Modal, Input, Checkbox, Button } from 'antd'
import { plugTypeOptions } from '../constants/options'

interface PlugTypeModalProps {
  open: boolean
  onClose: () => void
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
}

function PlugTypeModal({
  open,
  onClose,
  selectedValues,
  onSelectionChange,
}: PlugTypeModalProps) {
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() =>
    plugTypeOptions.filter(opt => !search || opt.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      onSelectionChange(plugTypeOptions.map(opt => opt.value))
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Input
              placeholder="搜索"
              prefix={<span>🔍</span>}
              style={{ width: 500 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Checkbox
              checked={selectedValues.length === plugTypeOptions.length}
              indeterminate={selectedValues.length > 0 && selectedValues.length < plugTypeOptions.length}
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

export default memo(PlugTypeModal)
