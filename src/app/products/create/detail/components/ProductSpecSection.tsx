'use client'

import { useCallback } from 'react'
import { Select, Input, Button } from 'antd'
import { PlusOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons'

export interface SpecChild {
  id: string
  value: string
}

export interface SpecParent {
  id: string
  label: string
  children: SpecChild[]
}

interface ProductSpecSectionProps {
  specs: SpecParent[]
  onSpecsChange: (specs: SpecParent[]) => void
  onOpenSizeChart: () => void
  sizeChartAdded: boolean
  onDeleteSizeChart: () => void
  onViewSizeChart: () => void
}

const SPEC_OPTIONS = [
  { value: '颜色', label: '颜色' },
  { value: '风格', label: '风格' },
  { value: '材质', label: '材质' },
  { value: '口味', label: '口味' },
  { value: '适用人群', label: '适用人群' },
  { value: '容量', label: '容量' },
]

function generateId() {
  return Math.random().toString(36).slice(2)
}

export default function ProductSpecSection({
  specs,
  onSpecsChange,
  onOpenSizeChart,
  sizeChartAdded,
  onDeleteSizeChart,
  onViewSizeChart,
}: ProductSpecSectionProps) {
  const usedLabels = specs.map(s => s.label)

  const handleAddParent = useCallback(() => {
    if (specs.length >= 2) return
    onSpecsChange([...specs, {
      id: generateId(),
      label: '',
      children: [{ id: generateId(), value: '' }],
    }])
  }, [specs, onSpecsChange])

  const handleDeleteParent = useCallback((parentId: string) => {
    onSpecsChange(specs.filter(s => s.id !== parentId))
  }, [specs, onSpecsChange])

  const handleParentLabelChange = useCallback((parentId: string, label: string) => {
    onSpecsChange(specs.map(s => s.id === parentId ? { ...s, label } : s))
  }, [specs, onSpecsChange])

  const handleAddChild = useCallback((parentId: string) => {
    onSpecsChange(specs.map(s =>
      s.id === parentId
        ? { ...s, children: [...s.children, { id: generateId(), value: '' }] }
        : s
    ))
  }, [specs, onSpecsChange])

  const handleDeleteChild = useCallback((parentId: string, childId: string) => {
    onSpecsChange(specs.map(s =>
      s.id === parentId
        ? { ...s, children: s.children.filter(c => c.id !== childId) }
        : s
    ))
  }, [specs, onSpecsChange])

  const handleChildValueChange = useCallback((parentId: string, childId: string, value: string) => {
    onSpecsChange(specs.map(s =>
      s.id === parentId
        ? { ...s, children: s.children.map(c => c.id === childId ? { ...c, value } : c) }
        : s
    ))
  }, [specs, onSpecsChange])

  return (
    <div>
      {/* 黄色提示横幅 */}
      <div style={{
        background: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: 4,
        padding: '10px 14px',
        marginBottom: 20,
        fontSize: 12,
        color: '#613400',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>
          请参照
          <span style={{ color: '#1677ff', cursor: 'pointer' }}>《C端展示效果&填写规范》</span>
          进行填写，有助于获取更多搜索流量，提升购买转化
        </span>
        <span style={{ color: '#faad14', fontSize: 18, lineHeight: 1 }}>☀</span>
      </div>

      {/* 父规格列表 */}
      {specs.map((parent, pIndex) => {
        const availableOptions = SPEC_OPTIONS.filter(
          opt => opt.value === parent.label || !usedLabels.includes(opt.value)
        )
        return (
          <div key={parent.id} style={{ border: '1px solid #f0f0f0', borderRadius: 4, marginBottom: 16 }}>
            {/* 父规格头部灰条 */}
            <div style={{
              background: '#fafafa',
              borderBottom: parent.label ? '1px solid #f0f0f0' : 'none',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ color: '#ff4d4f', fontSize: 12 }}>*</span>
              <span style={{ fontSize: 12, color: '#262626', minWidth: 40 }}>父规格{pIndex + 1}</span>
              <Select
                style={{ width: 200 }}
                size="small"
                placeholder="请选择"
                value={parent.label || undefined}
                onChange={(val) => handleParentLabelChange(parent.id, val)}
                options={availableOptions}
              />
              <div style={{ flex: 1 }} />
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteParent(parent.id)}
                style={{ color: '#8c8c8c', fontSize: 12, padding: 0 }}
              >
                删除
              </Button>
            </div>

            {/* 子规格区域 */}
            {!parent.label ? (
              /* 未选规格时的占位 */
              <div style={{
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8c8c8c',
                fontSize: 12,
              }}>
                请先选择父规格
              </div>
            ) : (
              <div style={{ padding: '0 16px 16px' }}>
                {/* 列头 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 0 8px',
                  borderBottom: '1px solid #f0f0f0',
                  marginBottom: 8,
                }}>
                  <div style={{ flex: 1, fontSize: 12, color: '#262626' }}>
                    <span style={{ color: '#ff4d4f' }}>*</span>
                    {parent.label}
                  </div>
                  <div style={{ width: 60, fontSize: 12, color: '#595959' }}>操作</div>
                </div>

                {/* 子规格行 */}
                {parent.children.map((child) => (
                  <div key={child.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <div style={{ flex: 1, paddingRight: 12 }}>
                      <Input
                        size="small"
                        placeholder="请输入"
                        value={child.value}
                        onChange={(e) => handleChildValueChange(parent.id, child.id, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div style={{ width: 60 }}>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => handleDeleteChild(parent.id, child.id)}
                        style={{ padding: 0, fontSize: 12 }}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}

                {/* 继续添加子规格 */}
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddChild(parent.id)}
                  style={{ fontSize: 12, marginTop: 4 }}
                >
                  继续添加子规格
                </Button>
              </div>
            )}
          </div>
        )
      })}

      {/* 添加父规格 2 按钮（最多两个，第一个存在时才显示） */}
      {specs.length === 0 && (
        <Button
          block
          icon={<PlusOutlined />}
          onClick={handleAddParent}
          style={{ marginBottom: 20, fontSize: 12 }}
        >
          添加父规格 1
        </Button>
      )}
      {specs.length === 1 && (
        <Button
          block
          icon={<PlusOutlined />}
          onClick={handleAddParent}
          style={{ marginBottom: 20, fontSize: 12 }}
        >
          添加父规格 2
        </Button>
      )}

      {/* 尺码表区域 */}
      <div style={{ marginTop: 4 }}>
        <div style={{ fontSize: 12, color: '#262626', marginBottom: 8 }}>尺码表</div>
        {sizeChartAdded ? (
          <div style={{
            border: '1px solid #f0f0f0',
            borderRadius: 4,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <CheckCircleFilled style={{ color: '#52c41a', fontSize: 16 }} />
            <span style={{ fontSize: 12, color: '#262626', flex: 1 }}>已添加</span>
            <Button type="link" size="small" onClick={onViewSizeChart} style={{ padding: 0, fontSize: 12 }}>查看</Button>
            <Button type="link" size="small" onClick={onOpenSizeChart} style={{ padding: 0, fontSize: 12 }}>编辑</Button>
            <Button type="link" size="small" danger onClick={onDeleteSizeChart} style={{ padding: 0, fontSize: 12 }}>删除</Button>
          </div>
        ) : (
          <div>
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={onOpenSizeChart}
              style={{ fontSize: 12 }}
            >
              添加尺码表
            </Button>
            <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 6 }}>
              填写尺码信息，有助于用户正确选择尺码，快速下单，减少售后纠纷
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
