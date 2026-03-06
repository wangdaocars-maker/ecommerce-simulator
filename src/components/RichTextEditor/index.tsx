'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { Select, message, Spin } from 'antd'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  minHeight?: number
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  minHeight = 400,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isFocusedRef = useRef(false)
  const isInitializedRef = useRef(false)
  const [uploading, setUploading] = useState(false)

  // 初始化内容（仅首次）
  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = value
      isInitializedRef.current = true
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // 外部 value 变化时同步（未聚焦状态，例如加载保存数据）
  useEffect(() => {
    if (editorRef.current && isInitializedRef.current && !isFocusedRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value])

  const notifyChange = useCallback(() => {
    onChange?.(editorRef.current?.innerHTML || '')
  }, [onChange])

  // 执行 execCommand 并通知变化
  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, val)
    notifyChange()
  }, [notifyChange])

  // 设置字号（用 font 元素技巧 + 替换为 span）
  const setFontSize = useCallback((px: string) => {
    editorRef.current?.focus()
    document.execCommand('fontSize', false, '7')
    const fontEls = editorRef.current?.querySelectorAll('font[size="7"]')
    fontEls?.forEach(el => {
      const span = document.createElement('span')
      span.style.fontSize = `${px}px`
      span.innerHTML = el.innerHTML
      el.replaceWith(span)
    })
    notifyChange()
  }, [notifyChange])

  // 图片上传
  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', '详细描述')
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        editorRef.current?.focus()
        document.execCommand('insertImage', false, data.data.url)
        notifyChange()
      } else {
        message.error(data.error || '图片上传失败')
      }
    } catch {
      message.error('图片上传失败')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [notifyChange])

  // 工具栏按钮（onMouseDown + preventDefault 防止编辑区失焦）
  const Btn = ({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) => (
    <button
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      style={{
        width: 32, height: 32,
        border: '1px solid #d9d9d9',
        background: '#fff',
        borderRadius: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: '#262626',
      }}
    >
      {children}
    </button>
  )

  const Divider = () => <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />

  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, position: 'relative' }}>
      {/* 工具栏第一行 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '8px',
        borderBottom: '1px solid #d9d9d9', background: '#fafafa', gap: 4, flexWrap: 'wrap',
      }}>
        <Btn title="粗体 (Ctrl+B)" onClick={() => exec('bold')}>
          <strong style={{ fontSize: 15 }}>B</strong>
        </Btn>
        <Btn title="斜体 (Ctrl+I)" onClick={() => exec('italic')}>
          <em style={{ fontSize: 15 }}>I</em>
        </Btn>
        <Btn title="下划线 (Ctrl+U)" onClick={() => exec('underline')}>
          <span style={{ textDecoration: 'underline', fontSize: 15 }}>U</span>
        </Btn>
        <Btn title="删除线" onClick={() => exec('strikeThrough')}>
          <span style={{ textDecoration: 'line-through', fontSize: 15 }}>S</span>
        </Btn>
        <Divider />
        <Btn title="左对齐" onClick={() => exec('justifyLeft')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/>
          </svg>
        </Btn>
        <Btn title="居中对齐" onClick={() => exec('justifyCenter')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 3h18v2H3V3zm3 4h12v2H6V7zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z"/>
          </svg>
        </Btn>
        <Btn title="右对齐" onClick={() => exec('justifyRight')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z"/>
          </svg>
        </Btn>
        <Divider />
        <Btn title="有序列表" onClick={() => exec('insertOrderedList')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
          </svg>
        </Btn>
        <Btn title="无序列表" onClick={() => exec('insertUnorderedList')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
          </svg>
        </Btn>
        <Divider />
        <Btn title="撤销 (Ctrl+Z)" onClick={() => exec('undo')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
          </svg>
        </Btn>
        <Btn title="重做 (Ctrl+Y)" onClick={() => exec('redo')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
          </svg>
        </Btn>
        <Divider />
        <Btn title="清除格式" onClick={() => exec('removeFormat')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6zm14 14.82L18.18 22 12 15.82 8.82 19H5v-3.18L1.82 12 5 8.82 5.18 9 7 10.82V12h1.82L12 15.18l1.82-1.82L20 19.82z"/>
          </svg>
        </Btn>
      </div>

      {/* 工具栏第二行 */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '8px',
        borderBottom: '1px solid #d9d9d9', background: '#fafafa', gap: 4, flexWrap: 'wrap',
      }}>
        <Select
          size="small"
          style={{ width: 100 }}
          defaultValue="p"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(v) => exec('formatBlock', v)}
          options={[
            { label: '正文', value: 'p' },
            { label: '标题1', value: 'h1' },
            { label: '标题2', value: 'h2' },
            { label: '标题3', value: 'h3' },
          ]}
        />
        <Select
          size="small"
          style={{ width: 120 }}
          defaultValue="default"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(v) => { if (v !== 'default') exec('fontName', v) }}
          options={[
            { label: '默认字体', value: 'default' },
            { label: '宋体', value: 'SimSun' },
            { label: '微软雅黑', value: 'Microsoft YaHei' },
            { label: 'Arial', value: 'Arial' },
          ]}
        />
        <Select
          size="small"
          style={{ width: 80 }}
          defaultValue="14"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(v) => setFontSize(v)}
          options={[
            { label: '12px', value: '12' },
            { label: '14px', value: '14' },
            { label: '16px', value: '16' },
            { label: '18px', value: '18' },
            { label: '20px', value: '20' },
            { label: '24px', value: '24' },
          ]}
        />
        <Divider />
        {/* 插入图片 */}
        <Btn title="插入图片" onClick={() => fileInputRef.current?.click()}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </Btn>
        <Divider />
        {/* 插入链接 */}
        <Btn title="插入链接" onClick={() => {
          const url = prompt('请输入链接地址：')
          if (url) exec('createLink', url)
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        </Btn>
        {/* 增加缩进 */}
        <Btn title="增加缩进" onClick={() => exec('indent')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
          </svg>
        </Btn>
        {/* 减少缩进 */}
        <Btn title="减少缩进" onClick={() => exec('outdent')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
          </svg>
        </Btn>
      </div>

      {/* 编辑区域 */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={notifyChange}
        onFocus={() => { isFocusedRef.current = true }}
        onBlur={() => { isFocusedRef.current = false }}
        className="rich-editor-content"
        data-placeholder={placeholder}
        style={{
          minHeight,
          padding: 16,
          outline: 'none',
          fontSize: 14,
          lineHeight: 1.6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          wordBreak: 'break-word',
        }}
      />

      {/* 隐藏的图片上传 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
        }}
      />

      {/* 上传中蒙层 */}
      {uploading && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 4, zIndex: 10,
        }}>
          <Spin tip="上传中..." />
        </div>
      )}
    </div>
  )
}
