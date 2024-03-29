import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import { useStore } from "../../zustand/store";
import { fitHTML } from "../../lib/resize";
import { setupView } from "../../lib/setup";
import { selectorStyler } from "../../lib/selectorStyler";
import { getMainView, getViewName } from "../../lib/getMainComp";
import { getHistory } from "../../lib/history";
import { createNewView } from "../../lib/createNewView";
import { GetServerSideProps } from "next";
import { IDesign } from "../../types/design";

export default function MainView({ data }: { data: IDesign }) {
  const { selectComp, setSelectComp } = useStore();
  const [zoom, setZoom] = useState(1);
  const { id } = useRouter().query

  const resetSelectComp = () => {
    if (!selectComp) return; //* 기존에 선택되어있던 컴포넌트가 있을경우에 초기화 해줌
    selectComp.childNodes.forEach(e => e.nodeType === 3 ? selectComp.contentEditable = "false" : null)
    selectComp.style.boxShadow = "";
    selectComp.style.cursor = ""
  }
  const handleViewBgClick = ({ target }: { target: HTMLElement }) => {
    const viewBg = document.getElementsByClassName(ViewBg.styledComponentId)[0]
    //* viewBg !== target : target이 viewBg일 때만 실행해야 이벤트 버블링된 하위 컴포넌트는 실행이 안됨
    if (viewBg !== target) return;
    resetSelectComp();
    setSelectComp(undefined)
  }

  const handleWheel = ({ deltaY }: { deltaY: number }) => {
    const view = document.getElementsByClassName(IframeView.styledComponentId)[0] as HTMLElement | null
    const viewBg = document.getElementsByClassName(ViewBg.styledComponentId)[0] as HTMLElement | null
    const container = document.getElementsByClassName(Container.styledComponentId)[0]
    const zoomValue = zoom + deltaY * 0.001
    if (view && viewBg && container) {
      setZoom(zoomValue)
      view.style.transform = `scale(${zoomValue})`
      viewBg.style.width = (view.offsetWidth * zoomValue) + 100 + "px"
      viewBg.style.height = (view.offsetHeight * zoomValue) + 100 + "px"
    }
  }

  useEffect(() => {
    if (typeof id !== "string") return;
    setupView({
      id, resize: () => { fitHTML(getMainView(), getMainView()?.parentElement?.parentElement, -80) }
    })
  }, [data, id])

  return (
    <Container>
      <ViewBg
        className="Background viewBg"
        onClick={handleViewBgClick}
        style={{ backgroundColor: "#C7C7C7" }}
      // onWheel={handleWheel}
      >
        <IframeView onLoad={() => {
          if (typeof id === "string")
            setupView({
              id, resize: () => { fitHTML(getMainView(), getMainView()?.parentElement?.parentElement, -80) }
            })
        }} id={getViewName()} />
      </ViewBg>
    </Container>
  )
}

const Container = styled.div`
  flex:1;
  z-index: 0;
  overflow: auto;
`
const IframeView = styled.iframe`
  width:360px;
  height:720px;
  z-index: 2;
  background-color:white;
  border-radius:12px;
`
const ViewBg = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  width:100%;
  height:100%;
  z-index: 2;
  iframe{
    width:360px;
    height:720px;
    z-index: 2;
    background-color:white;
    border-radius:12px;
  }
`