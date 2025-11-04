"use client"

import { RefObject } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Share } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import * as htmlToImage from "html-to-image"
import { useProgress } from "@bprogress/next"

function base64ToBlob(base64: string, mime = "image/png") {
  const byteString = atob(base64.split(",")[1])
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mime })
}

interface PrintShareControlsProps {
  contentRef: RefObject<HTMLDivElement | null>
  grade: number
  cls: string
  date: string
}

export function PrintShareControls({contentRef, grade, cls, date}: PrintShareControlsProps) {
  const { start, stop } = useProgress()
  const reactToPrintFn = useReactToPrint({ contentRef })

  const pxToMm = (px: number) => px * 25.4 / 96

  const handlePrint = () => {
    start()
    const parentWidth = 297
    const parentHeight = 210
    const el = contentRef.current
    if (!el) return

    const elWidth = pxToMm(el.offsetWidth)
    const elHeight = pxToMm(el.offsetHeight)

    const scaleX = parentWidth / elWidth
    const scaleY = parentHeight / elHeight
    const scale = Math.min(scaleX, scaleY, 1)
    el.style.setProperty('--scale', scale.toString())
    reactToPrintFn()
    stop()
  }

  const handleShare = () => {
    start()
    const seatView = document.getElementById("seat-view")
    if (!seatView) return

    htmlToImage.toPng(seatView).then((dataUrl) => {
      const img = new Image()
      img.src = dataUrl
      img.onload = () => {
        // scale image for kakao share
        let { width, height } = img
        const minSize = 400
        const maxSize = 800
        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width)
            width = maxSize
          } else if (width < minSize) {
            height = height * (minSize / width)
            width = minSize
          }
        }
        else {
          if (height > maxSize) {
            width = width * (maxSize / height)
            height = maxSize
          } else if (height < minSize) {
            width = width * (minSize / height)
            height = minSize
          }
        }

        const blob = base64ToBlob(dataUrl)
        const file = new File([blob], "image.png")

        window.Kakao.Share.uploadImage({
          file: [file]
        })
          .then(async function(response: any) {
            const imageUrl = response.infos.original.url
            const imagePath = new URL(imageUrl).pathname
            await window.Kakao.Share.sendCustom({
              templateId: 125500,
              templateArgs: {
                title: `${grade}학년 ${cls}반 자리 배치도`,
                date: date,
                image: imageUrl,
                width: width,
                height: height,
                path: imagePath
              }
            })
            stop()
          })
          .catch(function(error: any) {
            console.log(error)
            stop()
          })
      }
    })
  }

  return (
    <div className="flex gap-2 pl-4 border-l-2 border-muted-foreground/20">
      <Button 
        variant="outline" 
        size="sm"
        className="gap-2 hover:bg-primary/10"
        onClick={handlePrint}
      >
        <Printer className="w-4 h-4" />
        인쇄
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="gap-2 hover:bg-primary/10"
        onClick={handleShare}
      >
        <Share className="w-4 h-4" />
        공유
      </Button>
    </div>
  )
}