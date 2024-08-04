import {useEffect, useState} from 'react'
import './App.css'

function App() {
  return (
    <>
      <List getEndpoint={getListUrl}></List>
    </>
  )
}

export default App

type Item = {
  id: number,
  name: string
}

type ListProps = {
  getEndpoint: () => string
}
type ListState = {
  loading: boolean
  items: Item[]
}

function List(props: ListProps) {
  const endpoint = props.getEndpoint();
  const [state, setState] = useState({
    loading: true,
    items: []
  } as ListState);
  useEffect(() => {
    fetch(endpoint)
        .then(async r => {
            await delay(1);
          if (!r.ok) {
            throw new Error("Ошибка выполнения запроса:" + r.statusText);
          }
          setState({...state, loading: false, items: await r.json() as Item[]});
        })
        .catch(e => {
          alert(e.message);
          setState({...state, loading: false});
        })
  }, [state.loading, endpoint])
  return state.loading
      ? (<div>
            <span>Идёт загрузка...</span>
         </div>)
      : (
          <div>
            <ul>{state.items.map(item => (<li>{item.name}</li>))}</ul>
          </div>)
}

async function delay(secs: number) {
    return new Promise(resolve => setTimeout(resolve, secs*1000));
}

function Details(props) {

}

function getListUrl(): string {
  return "https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/users.json";
}

function getDetailsUrl(id: string): string {
  return `https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/${id}.json`;
}