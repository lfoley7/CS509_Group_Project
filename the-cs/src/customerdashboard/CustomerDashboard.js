import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './CustomerDashboard.css';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function CustomerDashboard(props) {

    const navigate = useNavigate();

    const fillTable = (projects) => {
        var element = document.getElementsByClassName("created-flag"), index;
        for (index = element.length - 1; index >= 0; index--) {
            element[index].parentNode.removeChild(element[index]);
        }
        // Clear table?
        projects.forEach(project => {
            console.log("LAUNCHED? " + project.project_launched);
            // Creating the Row
            var tr = document.createElement("tr");
            tr.className = "created-flag";
            // Creating the Cells
            var projectName = document.createElement("td");
            projectName.className = "dashboard-data projNameCell";
            projectName.onclick = () => {
                props.setProject(tr.childNodes[0].innerHTML);
                navigate("/dashboard/viewproject")
            };
            var projectType = document.createElement("td");
            projectType.className = "dashboard-data";
            projectType.onclick = () => {
                props.setProject(tr.childNodes[0].innerHTML);
                navigate("/dashboard/viewproject")
            };
            var goalAmount = document.createElement("td");
            goalAmount.className = "dashboard-data";
            goalAmount.onclick = () => {
                props.setProject(tr.childNodes[0].innerHTML);
                navigate("/dashboard/viewproject")
            };
            var amountReached = document.createElement("td");
            amountReached.className = "dashboard-data";
            amountReached.onclick = () => {
                props.setProject(tr.childNodes[0].innerHTML);
                navigate("/dashboard/viewproject")
            };
            var launchBtn;
            var launched;
            if (project.project_launched === 0) {
                launchBtn = document.createElement("div");
                launchBtn.innerHTML = "Launch";
                launchBtn.className = "launchBtn";
                launchBtn.onclick = () => {
                    launchProjects(projectName.innerHTML);
                };
            } else {
                launched = document.createElement("div");
                launched.className = "launched"
                launched.innerHTML = "Launched";
            }
            // Creating the Text in the Cells
            projectName.innerHTML = project.project_name;
            projectType.innerHTML = project.project_type;
            goalAmount.innerHTML = `\$${project.project_goal.toFixed(2)}`;
            amountReached.innerHTML = `\$${project.project_funded.toFixed(2)}`;
            // Getting the Table
            var projectsTable = document.getElementById("projects-table");
            // Appending the Cells to the Row
            tr.appendChild(projectName);
            tr.appendChild(projectType);
            tr.appendChild(goalAmount);
            tr.appendChild(amountReached);
            if (project.project_launched === 0) {
                tr.appendChild(launchBtn);
            } else {
                tr.appendChild(launched);
            }
            // Appending the Row to the Table
            projectsTable.appendChild(tr);
        })
    }

    const fetchAllProjects = () => {
        var email = props.email;
        instance.post("/designer/project/list", { "designer_email": email })
            .then(function (response) {
                console.log(response);
                fillTable(response.data.projects);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const launchProjects = (projName) => {
        var email = props.email;
        var project = projName;
        instance.post("/designer/project/launch", { "project_name": project, "designer_email": email })
            .then(function (response) {
                console.log(response);
                navigate("/dashboard");
            })
            .catch(function (error) {
                console.log(error);
                navigate("/dashboard");
            })
    }

    useEffect(() => {
        fetchAllProjects();
    }
    );

    return (
        <div style={{position:"relative", textAlign:"center", top: "5rem", whiteSpace: "pre-line"}}>
            {"Welcome to the Customer Dashboard!\nClick \"Sign in\" to go to the login page and sign into a different account type!"}
        </div>
    )
};

export default CustomerDashboard;