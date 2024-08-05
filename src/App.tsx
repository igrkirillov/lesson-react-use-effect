import {useEffect, useState, MouseEvent} from 'react'
import './App.css'

type AppState = {
    listEndpoint: string
    detailsEndpoint?: string
}
function App() {
    const [state, setState] = useState(createAppState(null));
    const onItemClick = (id: number) => {
      setState(createAppState(id));
      console.log(createAppState(id))
    }
    return (
      <div className="app-container">
        <List endpoint={state.listEndpoint} onItemClick={onItemClick}></List>
        <Details endpoint={state.detailsEndpoint}></Details>
      </div>
    )
}

function createAppState(itemId: number | null): AppState {
    return {
        listEndpoint: getListUrl(),
        detailsEndpoint: itemId === null ? null : getDetailsUrl(itemId)
    } as AppState;
}

export default App

type Item = {
  id: number,
  name: string,
    avatar: string,
    details: {
        city: string,
        company: string,
        position: string
    }
}

type ListProps = {
  endpoint: string
  onItemClick: (id: number) => void
}
type ListState = {
  loading: boolean
  items: Item[]
}

function List(props: ListProps) {
  const {endpoint, onItemClick} = props;
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
  }, [state.loading])
  const onLiClick = (event: MouseEvent<HTMLLIElement>) => {
      const id = event.currentTarget.dataset["id"];
      if (id !== undefined) {
          onItemClick(+id);
      }

  }
  return state.loading
      ? (<div>
            <span>Идёт загрузка...</span>
         </div>)
      : (
          <div className="list">
            <ul>{state.items.map(item => (<li className="list-item" onClick={onLiClick} data-id={item.id} key={item.id}>{item.name}</li>))}</ul>
          </div>)
}

async function delay(secs: number) {
    return new Promise(resolve => setTimeout(resolve, secs*1000));
}

type DetailsProps = {
    endpoint?: string
}

type DetailsState = {
    endpoint?: string
    loading: boolean
    item?: Item
}

function Details(props: DetailsProps) {
    const {endpoint} = props;
    const [state, setState] = useState({
        endpoint: endpoint,
        loading: !!endpoint
    } as DetailsState);
    useEffect(() => {
        if (endpoint) {
            fetch(endpoint)
                .then(async r => {
                    if (!r.ok) {
                        throw new Error("Ошибка выполнения запроса:" + r.statusText);
                    }
                    console.log("Запрос выполнен " + state)
                    setState({...state, endpoint: endpoint, loading: false, item: await r.json() as Item});
                })
                .catch(e => {
                    alert(e.message);
                    setState({...state, endpoint: endpoint, loading: false});
                })
        }
    }, [endpoint])
    return !state.loading && state.endpoint
        ? (
              <div className="container">
                  <div className="photo">
                      <img className="photo" src={`${state.item?.avatar}?${performance.now()}`} alt="photo"/>
                  </div>
                  <div className="name">
                      <span className="title">Name: </span>
                      <span>{state.item?.name}</span>
                  </div>
                  <div className="city">
                      <span className="title">City: </span>
                      <span>{state.item?.details?.city}</span>
                  </div>
                  <div className="position">
                      <span className="title">Position: </span>
                      <span>{state.item?.details?.position}</span>
                  </div>
              </div>)
        : (state.endpoint ? (<div><span>Идёт загрузка...</span></div>) : ((<div><span>Выберите персону!</span></div>)))
}

function getListUrl(): string {
  return "https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/users.json";
}

function getDetailsUrl(id: number): string {
  return `https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/${id}.json`;
}