import { Button, Col, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import { get, isEmpty }     from 'lodash';
import { getStarredList, getUser, getUserList } from "./action";

import NewContext      from "./context";
import Starred         from './starred';
import classnames from "classnames";

const token = localStorage.getItem("token");

function Home(props) {
 
  const { state, dispatch } = useContext(NewContext);
  
  const [activeTab, setActiveTab] = useState("1");
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  
  useEffect(() => {
    console.log("Home -> token", token);

    if(token) getUserData(token); 
  },[]);

  const getUserData = async(token) => {
    const logUserData = await getUser(token);
      await dispatch({ type: "get_logged_user_data", logUserData: logUserData });
    if (!isEmpty(logUserData)) getUserRepo(logUserData.login);
  };

  const getUserRepo = async (name) => {
    const userRepo = await getUserList(name);
    if (!userRepo.message && name) {
      dispatch({ type: "user_repo_list", userRepoList: userRepo });
      getStarredRepoList(name);
    } else {
      dispatch({ type: "error", error: userRepo && userRepo.message });
    }
  };

  const getStarredRepoList = async (name) => {
     const userStarredRepo = await getStarredList(name);
      if (userStarredRepo && !userStarredRepo.message && name) {
        dispatch({ type: "get_starred_repo", starredRepo: userStarredRepo });
      } else {
        dispatch({ type: "error", error: userStarredRepo && userStarredRepo.message });
      }
  };

  

  return (
    <>
      <div className="mt-2">
        <h2 className="mb-3 mt-3">Welcome {get(state, "logUserData.login")}</h2>
        <Button
          className="mr-3"
          style={{ float: "right" }}
          onClick={() => {localStorage.removeItem("token"); props.history.push('/')}}
        >
          Logout
        </Button>
        <Row className="mr-4">
          <Col>
            <Nav tabs>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === "1" })}
                  onClick={(() => { toggle("1"); props.history.push("/home"); })}
                >
                  User Repo
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === "2" })}
                  onClick={(() => { toggle("2"); props.history.push("/starred");})}
                >
                  Stared Repo
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {activeTab == "1" && (
                  <Row>
                    <Col sm="12">
                      <ListGroup>
                        {!isEmpty(state.error) && (
                          <ListGroupItem> {state.error} </ListGroupItem>
                        )}

                        {!isEmpty(get(state, "userRepo")) ? (
                          get(state, "userRepo").map((el) => {
                            return (
                              <ListGroupItem
                                key={el.id}
                                tag="a"
                                href={el.html_url}
                              >
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
                )}
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Starred getStarred={getStarredRepoList} />
                </Row>
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default withRouter(Home);