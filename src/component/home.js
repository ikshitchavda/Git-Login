import { Button, Col, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import React, { useContext, useState } from "react";
import { get, isEmpty }     from 'lodash';

import NewContext      from "./context";
import Starred         from './starred';
import classnames      from "classnames";

function Home(props) {

  const { state, dispatch } = useContext(NewContext);
  const [activeTab, setActiveTab] = useState("1");
   
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <div className="mt-2">
        <h2 className="mb-3 mt-3">Welcome {get(state, "logUserData.login")}</h2>
        <Button
          className="mr-3"
          style={{ float: "right" }}
          onClick={() => {
            props.clickOnLogout();
            localStorage.removeItem("token");
          }}
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
                  onClick={() => toggle("1") }
                >
                  User Repo
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => toggle("2")}
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
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Starred />
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