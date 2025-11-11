"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { writeFeedbackAction } from "@/app/actions/feedback"

interface FeedbackDialogProps {
  userEmail: string | null | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ userEmail, open, onOpenChange }: FeedbackDialogProps) {
  const [title, setTitle] = useState("")
  const [email, setEmail] = useState(userEmail ? userEmail : '')
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async () => {
    if (!title.trim() || !email.trim() || !content.trim()) {
      toast.error("제목과 이메일, 내용을 모두 입력해주세요.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("올바른 이메일을 입력해주세요.")
      return
    }

    startTransition(async () => {
      const res = await writeFeedbackAction(email, title, content)
      if (res.ok) {
        toast.success("의견이 기록되었습니다.")
        setTitle("")
        setContent("")
        onOpenChange(false)
      } else {
        toast.error(`의견 기록에 실패했습니다. ${res.message}`)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>의견 보내기</DialogTitle>
          <DialogDescription>
            기능 제안, 불편한 점, 문의사항 등 무엇이든 의견을 남겨주세요.<br />이메일 021325@hafs.hs.kr로 보내주셔도 됩니다.<br />오류 제보는 오른쪽 하단 버튼을 통해 해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              rows={8}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                기록 중...
              </>
            ) : (
              "보내기"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
