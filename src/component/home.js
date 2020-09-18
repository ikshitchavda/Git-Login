import { Button, Col, FormGroup, Input, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledDropdown } from "reactstrap";
import React, { useContext, useEffect, useState } from "react";

import NewContext   from "./context";
import classnames   from "classnames";
import { isEmpty }  from 'lodash';

function Home(props) {

  const repoType = {
    USER: "user",
    STARRED: "starred"
  }

  const userData = useContext(NewContext);
  const [activeTab, setActiveTab] = useState("1");
  const [userRepo, setUserRepo] = useState([]);
  const [starredRepo, setStarredRepo] = useState({});
  const [searchVal, setSearchVal] = useState();
  const [noDataFound, setNoDataFound] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState("");
   
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    getRepoList(repoType.USER);
  }, [userData]);
  
  const getRepoList = (tabName) => {
      const url =
        tabName === repoType.USER
          ? `https://api.github.com/users/${userData.login}/repos`
          : `https://api.github.com/users/${userData.login}/starred`;

      fetch(url)
        .then((response) => response.json())
        .then((result) => {
          if (
            !isEmpty(result) &&
            tabName === repoType.USER &&
            !result.message
          ) {
            setUserRepo(result);
          } else {
            setUserErrorMessage(result && result.message);
            setUserRepo([]);
          }

          if (
            !isEmpty(result) &&
            tabName === repoType.STARRED &&
            !result.message
          ) {
            setStarredRepo(result);
          } else {
            setUserErrorMessage(result && result.message);
            setStarredRepo([]);
          }
        })
        .catch((error) => console.log("error", error));
    
  };

  const getRepo = (tabName) => {
      getRepoList(tabName);
  }
  
  const searchBox = (searchVal) => {
    if (!isEmpty(searchVal)) {
        setTimeout(function () {
          fetch(`https://api.github.com/repos/${userData.login}/${searchVal}`)
            .then((response) => response.json())
            .then((result) => {
              if (!isEmpty(result) && !result.message) {
                setSearchVal(result);
                setNoDataFound(false);
              } else {
                setSearchVal();
                setNoDataFound(!noDataFound);
              }
            })
            .catch((error) => console.log("error", error));
        }, 2000);
    }
      
  }
  
  return (
    <>
    <div className="mt-2">
      <h2 className="mb-3 mt-3">Welcome {userData.login}</h2>
      <Button
        className="mr-3"
        style={{ float: "right" }}
        onClick={() => {props.clickOnLogout(); localStorage.removeItem('token');}}
      >
        Logout
      </Button>

      <FormGroup className="ml-3 col-md-3">
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="search git repo"
          onChange={(e) => searchBox(e.target.value)}
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
      <Row className="mr-4">
        <Col>
          <Nav tabs>
            <NavItem>
                <NavLink
                href="#"
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  toggle("1");
                  getRepo(repoType.USER);
                }}
              >
                User Repo
              </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                href="#"
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  toggle("2");
                  getRepo(repoType.STARRED);
                }}
              >
                Stared Repo
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <ListGroup>
                    {!isEmpty(userErrorMessage) && (
                      <ListGroupItem> {userErrorMessage} </ListGroupItem>
                    )}

                    {!isEmpty(userRepo) ? (
                      userRepo.map((el) => {
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
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <ListGroup>
                    {!isEmpty(userErrorMessage) && (
                      <ListGroupItem> {userErrorMessage} </ListGroupItem>
                    )}
                    {!isEmpty(starredRepo) ? (
                      starredRepo.map((el) => {
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
              </Row>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
        </div>
      </>
  );
}
export default Home;