import {
  Col,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem
} from "reactstrap";
import React, { useContext, useState } from "react";

import NewContext       from "./context";
import { isEmpty }      from "lodash";
import { searchBox }    from "./action";

function Starred() {
  const { state, dispatch } = useContext(NewContext);
  const [ noDataFound, setNoDataFound ] = useState("");
  const [ searchVal, setSearchVal] = useState();
  
  const handleSearch = async (searchValue) => {
    await setTimeout(() => {
       searchBox(searchValue, state.logUserData && state.logUserData.login).then(res => {
         console.log("***", res);
         if (res && res.message) {
           setSearchVal();
           setNoDataFound(!noDataFound);
         } else if (res && !res.message) {
           setSearchVal(res);
         }
      })
      }, 3000);
    
  }
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
          <ListGroup flush>
            {!isEmpty(searchVal) && (
              <ListGroupItem tag="a" href={searchVal.html_url}>
                {searchVal.name}
              </ListGroupItem>
            )}
            {noDataFound && <ListGroupItem>No Data Found</ListGroupItem>}
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