import * as React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Select,
  AdminHeader,
  Input,
  Navigation,
  Helpers,
  MenuBar,
  Spinner,
  Modal,
  TitleHeader,
} from "../../Containers";
import MaterialTable from "material-table";
import { sp } from "@pnp/sp";
import swal from "sweetalert";

const Unit = () => {
  // Helpers
  const history = useHistory();

  type IType =
    | "string"
    | "boolean"
    | "numeric"
    | "date"
    | "datetime"
    | "time"
    | "currency";
  const string: IType = "string";

  const [columns, setColumns] = React.useState([
    { title: "Location", field: "Title", type: "string" as const },
  ]);

  const [data, setData] = React.useState([]);
  const [Location, setLocation] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [id, setID] = React.useState(null);

  React.useEffect(() => {
    sp.web.lists
      .getByTitle(`Location`)
      .items.get()
      .then((res) => {
        setData(res);
      });
  }, []);

  // Menubar Items
  const menu = [
    { name: "Admin", url: "/admin/config/roles/add" },
    { name: "Roles", url: "/admin/config/roles" },
    { name: "Location", url: "/admin/config/location", active: true },
    { name: "Division", url: "/admin/config/division" },
  ];

  const submitHandler = (e) => {
    e.preventDefault();
    sp.web.lists
      .getByTitle("Location")
      .items.add({
        Title: Location,
      })
      .then((res) => {
        setOpen(false);
        swal("Success", "Location added Successfully", "success");
        sp.web.lists
          .getByTitle(`Location`)
          .items.get()
          .then((res) => {
            setData(res);
          });
      })
      .catch((e) => {
        swal("Warning!", "An Error Occured, Try Again!", "error");
        console.error(e);
      });
  };

  const editHandler = (e) => {
    e.preventDefault();
    sp.web.lists
      .getByTitle("Location")
      .items.getById(id)
      .update({
        Title: Location,
      })
      .then((res) => {
        setOpen(false);
        swal("Success", "Location Edited Successfully", "success");
        sp.web.lists
          .getByTitle(`Location`)
          .items.get()
          .then((res) => {
            setData(res);
          });
      })
      .catch((e) => {
        swal("Warning!", "An Error Occured, Try Again!", "error");
        console.error(e);
      });
  };
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      sp.web.lists
        .getByTitle("Location")
        .items.getById(id)
        .delete()
        .then((res) => {
          swal("Success", "Location has been deleted", "success");
          sp.web.lists
            .getByTitle(`Location`)
            .items.get()
            .then((res) => {
              setData(res);
            });
        });
    }
  };
  const openHandler = () => {
    setOpen(true);
    setEdit(false);
  };

  return (
    <div className="appContainer">
      <Navigation config={`active`} />
      <div className="contentsRight">
        <div className="contentPage">
          <div className="dashboard">
            <TitleHeader title="Location" />
            <MenuBar menu={menu} />
            <div className="btnContainer right">
              <button
                onClick={openHandler}
                className="mtn__btns mtn__blue"
                type="button"
              >
                Add Location
              </button>
            </div>
            <MaterialTable
              title=""
              columns={columns}
              data={data}
              options={{
                exportButton: true,
                actionsCellStyle: {
                  backgroundColor: "none",
                  color: "#FF00dd",
                },
                actionsColumnIndex: -1,

                headerStyle: {
                  backgroundColor: "#FFCC00",
                  color: "black",
                },
                rowStyle: {
                  fontSize: 13,
                },
              }}
              style={{
                boxShadow: "none",
                width: "100%",
                background: "none",
                fontSize: "13px",
              }}
              // icons={{Add: () => 'Add Row'}}
              actions={[
                {
                  icon: "visibility",
                  iconProps: { style: { fontSize: "11px", color: "gold" } },
                  tooltip: "Edit",

                  onClick: (event, rowData) => {
                    setEdit(true);
                    setOpen(true);
                    setID(rowData.ID);
                    setLocation(rowData.Title);
                  },
                },
                {
                  icon: "visibility",
                  iconProps: { style: { fontSize: "11px", color: "gold" } },
                  tooltip: "Delete",

                  onClick: (event, rowData) => {
                    deleteHandler(rowData.ID);
                  },
                },
              ]}
              components={{
                Action: (props) => (
                  <button
                    onClick={(event) => props.action.onClick(event, props.data)}
                    className="mtn__btn_table mtn__black"
                  >
                    {props.action.tooltip}
                  </button>
                ),
              }}
            />
            <Modal
              isVisible={open}
              title="Location"
              size="lg"
              content={
                loading ? (
                  <Spinner />
                ) : (
                  <div className="mtn__InputFlex">
                    <Input
                      title="Location"
                      value={Location}
                      onChange={(e) => setLocation(e.target.value)}
                      type="text"
                      size="mtn__adult"
                    />

                    <button
                      onClick={edit ? editHandler : submitHandler}
                      type="button"
                      className="mtn__btn mtn__yellow"
                    >
                      {edit ? "Edit Location" : "Add Location"}
                    </button>
                  </div>
                )
              }
              onClose={() => setOpen(false)}
              footer=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unit;
