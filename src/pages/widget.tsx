import { useEffect, useState } from 'react';
import styled from 'styled-components'
import Header from '../components/home/header';
import LeftSideBar from "../components/home/leftSideBar"
import MainView from '../components/home/mainView';
import { IDesign } from '../types/design';
import { useStore } from '../zustand/store';
import { setupValue } from '../lib/setup';

export default function Widget() {
  const [list, setList] = useState<IDesign[]>()
  const { setSelectComp } = useStore();

  useEffect(() => {
    setSelectComp(undefined);
    setList(setupValue("widget"));
  }, [setSelectComp])

  return (
    <Container>
      <Header />
      <Main>
        <LeftSideBar />
        <DesignWrap>
          {
            list?.map((value, key) => (
              <MainView type={"widget"} width={"100%"} height={"100%"} key={key} {...value} />
            ))
          }
        </DesignWrap>
      </Main>
    </Container>
  )
}

const Container = styled.main`
  width:100vw;
  display: flex;
  flex-direction: column;
`
const Main = styled.div`
  width:100%;
  display:flex;
`
const DesignWrap = styled.div`
  width:calc(100% - 240px);
  height:100%;
  overflow:auto;
  max-height:calc(100vh - 48px);
  display:flex;
  flex-wrap: wrap;
`

