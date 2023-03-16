import { useRouter } from "next/router";
import * as ReactDOM from 'react-dom/client';
import { useEffect, useState } from "react"
import styled from "styled-components"
import { getHistory } from "../../lib/history";
import { useStore } from "../../zustand/store";
import NewView from "../design/newView"

export default function CompyView() {
  const { selectComp, setSelectComp } = useStore();
  const [zoom, setZoom] = useState(1);
  const canEditTag = ["H1", "H2", "H3", "H4", "H5", "P", "A"];
  const param = useRouter().query.id;

  const resetSelectComp = () => {
    if (selectComp) { //* 기존에 선택되어있던 컴포넌트가 있을경우에 초기화 해줌
      if (canEditTag.includes(selectComp.tagName)) selectComp.contentEditable = "false"; //* 글수정 상태에서 바꿀때 그걸 false해줌
      selectComp.style.boxShadow = "";
      selectComp.style.cursor = ""
    }
  }
  const HandleViewBgClick = ({ target }: { target: HTMLElement }) => {
    const viewBg = document.getElementsByClassName(ViewBg.styledComponentId)[0]
    //* viewBg !== target : target이 viewBg일 때만 실행해야 이벤트 버블링된 하위 컴포넌트는 실행이 안됨
    if (viewBg !== target) return;
    resetSelectComp();
    setSelectComp(undefined)
  }

  const handleWheel = ({ deltaY }: { deltaY: number }) => {
    const view = document.getElementsByClassName(View.styledComponentId)[0] as HTMLElement | null
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

  async function appendViewInIframe(html: string) {
    const iDoc = (document.getElementById("iframe") as HTMLIFrameElement | null)?.contentWindow?.document
    if (!iDoc) return;
    const main = iDoc.createElement("div")
    iDoc.body.appendChild(main)
    const root = ReactDOM.createRoot(main);
    await root.render(<NewView html={html} isOnlyView={false} dom={iDoc} param={param} />);
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || JSON.stringify(null))
    const id = "0"
    if (!user.id || id !== user.id) {
      console.log("옳바른 사용자가 아닙니다.")
      return
    }
    if (typeof param !== "string") return;
    const history = getHistory({ id: param })
    // if (!history || refreshExpired({ id: "design" })) {
    //   sessionStorage.clear()
    //   setRefresh({ id: "design" })
    //   const temp = `<div class="App app" style="width:100%;height:100%;background-color:red;border-radius:12px;"><h1 style="font-color:black">CHange!!!</h1></div>`
    //   view.innerHTML = temp
    //   saveHistory({ id: temp, value: temp })
    // } else if (history) view.innerHTML = history[0];
    if (history) appendViewInIframe(history[0])

  }, [param])

  return (
    <Container>
      <ViewBg
        id="viewBg"
        style={{ backgroundColor: "#C7C7C7" }}
        onClick={HandleViewBgClick}
      // onWheel={handleWheel}
      >
        <View id="iframe" />
      </ViewBg>
    </Container >
  )
}

const Container = styled.div`
  flex:1;
  overflow: scroll;
  z-index: 0;
`
const View = styled.iframe`
  width:360px;
  height:720px;
  z-index: 2;
`
const ViewBg = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  min-width:100%;
  min-height:100%;
  width:460px;
  height:820px;
  overflow: scroll;
  z-index: 2;
`
const Viewa = styled.div``