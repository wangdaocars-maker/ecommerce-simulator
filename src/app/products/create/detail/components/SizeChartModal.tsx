'use client'

import { useState, useEffect, useCallback } from 'react'
import { Modal, Checkbox, Button, Input } from 'antd'
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons'

// 所有可选尺码参数
const ALL_PARAMS = [
  '肩宽(cm)', '胸围全围(cm)', '衣长(cm)', '袖长(cm)', '腰围全围(cm)',
  '臀围全围(cm)', '大腿围全围(cm)', '裤长(cm)', '裤内长(cm)', '裙长(cm)',
  '下胸围(cm)', '上下胸围差(cm)', '脚长(cm)', '脚宽(cm)', '尺码(cm)',
  '长度(cm)', '宽度(cm)', '高度(cm)', '颈围(cm)', '后身长(cm)',
  '圆周(cm)', '带子长(cm)', '杯高(cm)', '领围(cm)', '脚掌围(cm)',
  '夹圈(cm)', '前浪长(cm)', '后浪长(cm)', '背长(cm)', '脚掌宽度(cm)',
  '脚掌长度(cm)', '鞋台高(cm)', '靴筒高(cm)', '小腿围(cm)', '靴口围(cm)',
  '跟高(cm)', '适合重量(lbs)', '直径(cm)', '高(cm)', '宽(cm)',
  '长(cm)', '净重(g)', '净容量(ml)', '厚度(cm)', '头围(cm)',
  '袖口(cm)', '镜片距离(cm)', '镜高(cm)', '镜宽(cm)', '带子长度(cm)',
  '表盘厚度(cm)', '带子宽度(cm)', '手柄高度(cm)', '表盘尺寸(cm)', '内部容积(gal)',
  '风扇叶长度(cm)', '周长(cm)', '帽檐长度(cm)', '头发长度(cm)', '镜腿长(cm)',
  '鼻梁架长度(cm)', '镜框高(cm)', '镜框宽(cm)', '手腕周长(cm)', '最大承重(lbs)',
  '带宽(cm)', '肩带长度(cm)', '大腿长度(cm)', '小腿长度(cm)', '鞋内长(cm)',
  '下摆围(cm)', '袖口围(cm)', '填充重量(g)',
]

export interface SizeChartRow {
  id: string
  sizeName: string
  // 参数名 -> { value: string, isRange: boolean, rangeMax: string }
  params: Record<string, { value: string; isRange: boolean; rangeMax: string }>
}

export interface SizeChartData {
  selectedParams: string[]
  rows: SizeChartRow[]
}

interface SizeChartModalProps {
  open: boolean
  onConfirm: (data: SizeChartData) => void
  onCancel: () => void
  initialData?: SizeChartData | null
}

function generateId() {
  return Math.random().toString(36).slice(2)
}

function createEmptyRow(params: string[]): SizeChartRow {
  const p: SizeChartRow['params'] = {}
  params.forEach(param => {
    p[param] = { value: '', isRange: false, rangeMax: '' }
  })
  return { id: generateId(), sizeName: '', params: p }
}

export default function SizeChartModal({
  open,
  onConfirm,
  onCancel,
  initialData,
}: SizeChartModalProps) {
  const [selectedParams, setSelectedParams] = useState<string[]>(
    initialData?.selectedParams ?? []
  )
  const [rows, setRows] = useState<SizeChartRow[]>(
    initialData?.rows ?? []
  )

  // 打开时同步 initialData
  useEffect(() => {
    if (open) {
      if (initialData) {
        setSelectedParams(initialData.selectedParams)
        setRows(initialData.rows)
      } else {
        setSelectedParams([])
        setRows([])
      }
    }
  }, [open, initialData])

  // 勾选/取消参数
  const handleParamToggle = useCallback((param: string, checked: boolean) => {
    setSelectedParams(prev => {
      const next = checked ? [...prev, param] : prev.filter(p => p !== param)
      // 同步更新行的 params 字段
      setRows(rows => rows.map(row => {
        const newParams = { ...row.params }
        if (checked) {
          if (!newParams[param]) {
            newParams[param] = { value: '', isRange: false, rangeMax: '' }
          }
        } else {
          delete newParams[param]
        }
        return { ...row, params: newParams }
      }))
      return next
    })
  }, [])

  // 添加行
  const handleAddRow = useCallback(() => {
    setRows(prev => [...prev, createEmptyRow(selectedParams)])
  }, [selectedParams])

  // 删除行
  const handleDeleteRow = useCallback((id: string) => {
    setRows(prev => prev.filter(r => r.id !== id))
  }, [])

  // 上移行
  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return
    setRows(prev => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }, [])

  // 下移行
  const handleMoveDown = useCallback((index: number) => {
    setRows(prev => {
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }, [])

  // 修改行某参数
  const handleCellChange = useCallback((rowId: string, param: string, field: 'value' | 'rangeMax', val: string) => {
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, params: { ...r.params, [param]: { ...r.params[param], [field]: val } } }
        : r
    ))
  }, [])

  // 切换范围区间
  const handleRangeToggle = useCallback((rowId: string, param: string, checked: boolean) => {
    setRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, params: { ...r.params, [param]: { ...r.params[param], isRange: checked } } }
        : r
    ))
  }, [])

  // 修改尺码名称
  const handleSizeNameChange = useCallback((rowId: string, val: string) => {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, sizeName: val } : r))
  }, [])

  const handleConfirm = useCallback(() => {
    onConfirm({ selectedParams, rows })
  }, [selectedParams, rows, onConfirm])

  const showTable = selectedParams.length > 0

  return (
    <Modal
      title="尺码表"
      open={open}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>确定</Button>,
      ]}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto', padding: '16px 24px' } }}
    >
      {/* 参数多选区 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: '#262626', fontWeight: 'bold', marginBottom: 10 }}>
          选择尺码参数
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px 16px',
          background: '#fafafa',
          border: '1px solid #f0f0f0',
          borderRadius: 4,
          padding: '12px 16px',
        }}>
          {ALL_PARAMS.map(param => (
            <Checkbox
              key={param}
              checked={selectedParams.includes(param)}
              onChange={e => handleParamToggle(param, e.target.checked)}
              style={{ fontSize: 12 }}
            >
              {param}
            </Checkbox>
          ))}
        </div>
      </div>

      {/* 表格区（只有选了参数才显示） */}
      {showTable && (
        <div>
          <div style={{ fontSize: 12, color: '#262626', fontWeight: 'bold', marginBottom: 10 }}>
            尺码数据
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={thStyle}>无规格默认尺码</th>
                  {selectedParams.map(param => (
                    <th key={param} style={thStyle}>{param}</th>
                  ))}
                  <th style={thStyle}>操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={selectedParams.length + 2}
                      style={{ textAlign: 'center', color: '#8c8c8c', padding: '16px 0', fontSize: 12 }}
                    >
                      暂无数据，请点击下方"添加尺码"
                    </td>
                  </tr>
                ) : (
                  rows.map((row, rowIndex) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      {/* 尺码名称 */}
                      <td style={tdStyle}>
                        <Input
                          size="small"
                          style={{ width: 100 }}
                          placeholder="如: S / M / L"
                          value={row.sizeName}
                          onChange={e => handleSizeNameChange(row.id, e.target.value)}
                        />
                      </td>
                      {/* 参数值 */}
                      {selectedParams.map(param => {
                        const cell = row.params[param] ?? { value: '', isRange: false, rangeMax: '' }
                        return (
                          <td key={param} style={tdStyle}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Input
                                  size="small"
                                  style={{ width: cell.isRange ? 60 : 80 }}
                                  placeholder={cell.isRange ? '最小' : '数值'}
                                  value={cell.value}
                                  onChange={e => handleCellChange(row.id, param, 'value', e.target.value)}
                                />
                                {cell.isRange && (
                                  <>
                                    <span style={{ color: '#8c8c8c' }}>-</span>
                                    <Input
                                      size="small"
                                      style={{ width: 60 }}
                                      placeholder="最大"
                                      value={cell.rangeMax}
                                      onChange={e => handleCellChange(row.id, param, 'rangeMax', e.target.value)}
                                    />
                                  </>
                                )}
                              </div>
                              <Checkbox
                                checked={cell.isRange}
                                onChange={e => handleRangeToggle(row.id, param, e.target.checked)}
                                style={{ fontSize: 11 }}
                              >
                                范围区间
                              </Checkbox>
                            </div>
                          </td>
                        )
                      })}
                      {/* 操作列 */}
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <Button
                          type="text"
                          size="small"
                          icon={<UpOutlined />}
                          onClick={() => handleMoveUp(rowIndex)}
                          disabled={rowIndex === 0}
                          style={{ padding: '0 4px' }}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<DownOutlined />}
                          onClick={() => handleMoveDown(rowIndex)}
                          disabled={rowIndex === rows.length - 1}
                          style={{ padding: '0 4px' }}
                        />
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteRow(row.id)}
                          style={{ padding: '0 4px' }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Button
            type="dashed"
            size="small"
            onClick={handleAddRow}
            style={{ marginTop: 10, fontSize: 12 }}
          >
            + 添加尺码
          </Button>
        </div>
      )}
    </Modal>
  )
}

const thStyle: React.CSSProperties = {
  padding: '6px 10px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: 12,
  whiteSpace: 'nowrap',
  borderRight: '1px solid #e8e8e8',
}

const tdStyle: React.CSSProperties = {
  padding: '8px 10px',
  verticalAlign: 'top',
  borderRight: '1px solid #f0f0f0',
}
