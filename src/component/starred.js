import {
  Badge,
  Col,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import React, { useContext, useState } from "react";
import { addStarredRepo, removeStarredRepo, searchBox } from "./action";

import NewContext       from "./context";
import { isEmpty }      from "lodash";

function Starred(props) {
  const { state, dispatch } = useContext(NewContext);
  const [ noDataFound, setNoDataFound ] = useState("");
  const [ searchVal, setSearchVal] = useState("");
  
  const handleSearch = async (searchValue) => {
    await setTimeout(() => {
       searchBox(searchValue, state.logUserData && state.logUserData.login).then(res => {
         console.log("***", res);
         if (res && res.message) {
           setSearchVal();
           setNoDataFound(!noDataFound);
         } else if (res && !res.message) {
           setSearchVal(res.items);
         }
      })
      }, 3000);
    
  }
  
  const addStart = async(author, repo) => {
    await addStarredRepo(author, repo, state.token).then((res) => {
        if (res.status === 204) props.getStarred(state.logUserData.login);
        setSearchVal("");
      }
    );
  }

  const removeStart = async (author, repo) => {
    await removeStarredRepo(author, repo, state.token).then((res) => {
      if (res.status === 204) props.getStarred(state.logUserData.login);
       setSearchVal("");
    });
  };

  const style = {
    maxHeight: "300px",
    marginBottom: "10px",
    overflow: "scroll",
    WebkitOverflowScrolling: "touch",
  };


    return (
      <>
        <FormGroup className="mt-3 ml-3 col-md-3">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="search git repo"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <ListGroup style={!isEmpty(searchVal) ? style : {}}>
            {!isEmpty(searchVal) &&
              searchVal.map((el) => {
                return (
                  // tag="a" href={el.html_url}
                  <ListGroupItem>
                    {el.name}
                    <Badge
                      className="ml-2 mr-2 float-right"
                      href="#"
                      pill
                      onClick={() => addStart(el.owner.login, el.name)}
                    >
                      Add Star
                    </Badge>
                  </ListGroupItem>
                );
              })}
            {noDataFound && !isEmpty(searchVal) && <ListGroupItem>No Data Found</ListGroupItem>}
          </ListGroup>
        </FormGroup>

        <Col sm="12">
          <ListGroup>
            {!isEmpty(state.error) && (
              <ListGroupItem> {state.error} </ListGroupItem>
            )}
            {!isEmpty(state.starredRepo) ? (
              state.starredRepo.map((el) => {
                return (
                  <ListGroupItem key={el.id} tag="a" href={el.html_url}>
                    {el.name}
                    <Badge
                      className="ml-2 mr-2"
                      href="#"
                      pill
                      onClick={() => removeStart(el.owner.login, el.name)}
                    >
                      Remove Starred
                    </Badge>
                  </ListGroupItem>
                );
              })
            ) : (
              <ListGroupItem> No Data Found </ListGroupItem>
            )}
          </ListGroup>
        </Col>
      </>
    );
}

export default Starred;