import type { Meta, StoryObj } from '@storybook/react'
import { useArgs } from '@storybook/preview-api'
import * as Dialog from '@barebone-ui/dialog'

import './styles.css'

const meta = {
  title: 'Dialog',
  component: Dialog.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog.Root>

export default meta
type Story = StoryObj<typeof meta>

export const Uncontrolled: Story = {
  args: {
    defaultOpen: false,
    onOpenChange: (open) => {
      console.log('open', open)
    },
  },
  render: (args) => {
    return (
      <Dialog.Root {...args}>
        <Dialog.Trigger>열기</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="backdrop" />
          <Dialog.Content className="content">
            <Dialog.Title>제목</Dialog.Title>
            <Dialog.Description>설명</Dialog.Description>
            <Dialog.CloseTrigger>닫기</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  },
}

export const Controlled: Story = {
  render: function Render() {
    const [args, updateArgs] = useArgs<Dialog.RootProps>()

    return (
      <>
        <button type="button" onClick={() => updateArgs({ open: true })}>
          외부에서 열기
        </button>
        <Dialog.Root {...args} onOpenChange={(open) => updateArgs({ open })}>
          <Dialog.Trigger>열기</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="backdrop" />
            <Dialog.Content className="content">
              <Dialog.Title>제목</Dialog.Title>
              <Dialog.Description>설명</Dialog.Description>
              <Dialog.CloseTrigger>닫기</Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    )
  },
}

export const Nested: Story = {
  render: () => {
    return (
      <>
        <Dialog.Root>
          <Dialog.Trigger>다이얼로그 1 열기</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="backdrop" />
            <Dialog.Content className="content">
              <Dialog.Title>제목</Dialog.Title>
              <Dialog.Description>설명</Dialog.Description>
              <Dialog.CloseTrigger>닫기</Dialog.CloseTrigger>

              <Dialog.Root>
                <Dialog.Trigger>다이얼로그 2 열기</Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Backdrop className="backdrop" />
                  <Dialog.Content
                    className="content"
                    style={{ width: '300px' }}
                  >
                    <Dialog.Title>제목</Dialog.Title>
                    <Dialog.Description>설명</Dialog.Description>
                    <Dialog.CloseTrigger>닫기</Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    )
  },
}
