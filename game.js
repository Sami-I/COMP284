// Array representation of the initial grid
var grid =
    [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

// Variables for the HTML elements
var table = document.getElementById("gridTable")
var gameStageHeader = document.getElementById("gameStageHeader")
var startButton = document.getElementById("startBtn")
var moveButton = document.getElementById("moveBtn")
var endButton = document.getElementById("endBtn")
var restartButton = document.getElementById("restartBtn")


// Variables for the game
var round = 0
var subFuel = 10
var totalFuels = 0
var totalKillers = 0
var playerScore = 0
var computerScore = 0
var validSetupInput = "56789uokUOK"
var validPlayInput = "awdxAWDX"
var userSubExists = false
var gameStage = "setup"
// Variables to store the co-ordinates of the user submarine's current location
var subX = 0
var subY = 0
// Array to store the killer subs positions
var killerSubs = []
// Array of directions to move a killer sub
var directions = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]

/**
* Clears text from a HTML text element from the page
* @param id id of the HTML element
*/
function clearMessage(id) {
    var m1 = document.getElementById(id);
    m1.style.display = "none";
}
/**
* Shows a message on the webpage
* @param id id of the HTML element to display the message on
* @param message the content of the message to be displayed
* @param style the style e.g colour of the message
*/
function showMessage(id, message, style) {
    var m1 = document.getElementById(id);
    m1.innerHTML = message;
    m1.style.display = "block";
    m1.className = style;
}

/**
* Sets the grid up based on the objects the users wants to place
* @param x X co-ordinate of the cell to place the object on
* @param y Y co-ordinate of the cell to place  the object on
* @param event event triggered by clicking on the cell in the grid
*/
function setUpGrid(x, y, event) {
    console.log("x = " + x + " y = " + y)
    // Check if the grid position is already occupied
    if (grid[y][x] != 0) {
        alert("Grid position [" + x + "," + y + "] is already occupied, please select another cell")
    }
    else {
        // Prompt the user for input to insert into the grid
        var cellInput = prompt("Enter a value to place an object on the cell  [" + x + "," + y + "] ")
        // When the user clicks the cancel button on the prompt -> no action
        if (cellInput === null) {
        }
        // Validate the input
        else if (!validSetupInput.includes(cellInput) || cellInput === "" || cellInput.length != 1) {
            alert("Please enter a valid value for the cell")
        }

        // Check if the user has already placed a submarine
        else if ("uU".includes(cellInput) && userSubExists) {
            alert("You cannot place another user submarine")
        }
        else {
            // If the input wasn't for a fuel cell then make the character uppercase
            // so it's nicer on the grid
            if ("uok".includes(cellInput)) {
                cellInput = cellInput.toUpperCase()
            }
            // Set flag for the existence of the users submarine to true if the cell input was "U"
            if (cellInput == "U") {
                event.target.className = "BlueCell"
                userSubExists = true
                // Store co-ordinates of the user's submarine
                subX = x
                subY = y
            }
            // If killer submarine placed, increment the total killer subs
            if (cellInput == "K") {
                event.target.className = "RedCell"
                totalKillers++
                // Push position of the killer sub's cell
                killerSubs.push([x, y])
            }
            // If fuel placed, increment the total fuels
            if ("56789".includes(cellInput)) {
                event.target.className = "YellowCell"
                totalFuels++
            }
            if (cellInput == "O") {
                event.target.className = "BlackCell"
            }
            // Add user's input onto the grid array and  on the cell on the table
            grid[y][x] = cellInput
            event.target.innerHTML = cellInput
        }
    }
}

// Starts the game, called when user clicks the end setup button
function startGame() {
    if (!userSubExists) {
        alert('You must place a user submarine: "U" to proceed to the play stage of the game ')
    }
    else if (totalKillers == 0 || totalFuels == 0) {
        endGame()
    }
    else {
        round++
        gameStage = "play"
        // Make some adjustments to the page for the play stage of the game
        gameStageHeader.innerHTML = "Play stage"
        clearMessage("txtAboveGrid")
        showMessage("txtAboveGrid", "Please click on the move button and enter:<br> A direction (W,A,D,X) to move your submarine", "BlackFont")
        showMessage("results", "Round: " + round + "<br> Submarine fuel: " + subFuel + "<br> User score: " + playerScore + "<br> Computer score: " + computerScore, "BlackFont")
        startButton.style.visibility = "hidden";
        moveButton.style.visibility = "visible";
        endButton.style.visibility = "visible";
    }
}

// End stage of the game
function endGame() {
    gameStage = "end"

    // Make some changes to the webpage for the end stage
    gameStageHeader.innerHTML = "Game Over!"
    startButton.style.visibility = "hidden"
    moveButton.style.visibility = "hidden"
    endButton.style.visibility = "hidden"
    restartBtn.style.visibility = "visible"

    clearMessage("txtAboveGrid")

    // Determine winner
    if (totalKillers == 0 && totalFuels == 0) {
        showMessage("txtAboveGrid", "No killer submarines and fuel placed!", "RedFont")
    }
    else if (totalKillers == 0) {
        showMessage("txtAboveGrid", "No killer submarines placed!", "RedFont")
    }
    else if (totalFuels == 0 && subFuel == 10) {
        showMessage("txtAboveGrid", "No fuel placed!", "RedFont")
    }
    else if ((totalKillers == 0 || totalFuels == 0) && playerScore > computerScore) {
        showMessage("txtAboveGrid", "User wins!<br> User's score: " + playerScore + "<br> Computer's score: " + computerScore, "GreenFont")

    }
    else if (totalFuels == 0 && computerScore > playerScore) {
        showMessage("txtAboveGrid", "Computer wins!<br> User's score: " + playerScore + "<br> Computer's score: " + computerScore, "RedFont")
    }
    else if (!userSubExists) {
        showMessage("txtAboveGrid", "Computer wins!<br> User's submarine has been destroyed!", "RedFont")

    }
    else {
        showMessage("txtAboveGrid", "Game is a draw!<br> User's score: " + playerScore + "<br> Computer's score: " + computerScore, "OrangeFont")
    }

    if (round != 0) {
        round--
    }
    showMessage("results", "Round: " + round + "<br> Submarine fuel: " + subFuel + "<br> User's score: " + playerScore + "<br> Computer's score: " + computerScore, "BlackFont")

}

// Restart the game by reloading the webpage
function restart() {
    window.location.reload();
}

/**
* Clears a submarine from the grid and the table on the HTML page
* @param x X co-ordinate of the submarine to remove
* @param y Y co-ordinate of the submarine to remove
*/
function clearSub(x, y) {
    grid[y][x] = 0
    table.rows[y].cells[x].innerHTML = " ";
}

/**
* Checks if a submarine hits an obstacle
* @param x X co-ordinate of the cell the submarine attempts to move to
* @param y Y co-ordinate of the cell the submarine attempts to move to
* @return true if an obstacle is in that position on the grid, false otherwise
*/
function hitsObstacle(x, y) {
    if (grid[y][x] == "O") {
        console.log("hits obstacle")
        return true
    }
    else {
        return false
    }

}

/**
* Checks if a submarine hits a fuel cell
* @param x X co-ordinate of the cell the submarine attempts to move to
* @param y Y co-ordinate of the cell the submarine attempts to move to
* @return true if fuel is in that position on the grid, false otherwise
*/
function hitsFuelCell(x, y) {
    if ("56789".includes(grid[y][x])) {
        return true
    }
    else {
        return false
    }

}

/**
* Checks if co-ordinates are outside the grid's boundaries
* @param x X co-ordinate of the cell the submarine attempts to move to
* @param y Y co-ordinate of the cell the submarine attempts to move to
* @return true if co-ordinates are outside the grid, false otherwise
*/
function outsideGrid(x, y) {
    var gridBoundary = grid.length - 1
    if (x < 0 || x > gridBoundary || y < 0 || y > gridBoundary) {
        console.log("outside grid")
        return true
    }
    else {
        return false
    }
}

/**
* Checks if a submarine hits a killer submarine
* @param x X co-ordinate of the cell the submarine attempts to move to
* @param y Y co-ordinate of the cell the submarine attempts to move to
* @return true if a killer submarine is in that position on the grid, false otherwise
*/
function hitsKillerSub(x, y) {
    if (grid[y][x] == "K") {
        console.log("hits killer sub")
        return true
    }
    else {
        return false
    }

}

/**
* Checks if a killer submarine hits a user submarine
* @param x X co-ordinate of the cell the submarine attempts to move to
* @param y Y co-ordinate of the cell the submarine attempts to move to
* @return true if a user submarine is in that position on the grid, false otherwise
*/
function hitsUserSub(x, y) {
    if (grid[y][x] == "U") {
        console.log("hits user sub")
        return true
    }
    else {
        return false
    }

}

/**
* Moves the users submarine to the specified co-ordinates
* @param x X co-ordinate of the cell to move to
* @param y Y co-ordinate of the cell to move to
*/
function moveUserSub(x, y) {
    // Remove the users submarine from its current location
    clearSub(subX, subY)
    subFuel--
    if (hitsFuelCell(x, y)) {
        totalFuels--
        var fuelCell = parseInt(grid[y][x])
        subFuel += fuelCell
        playerScore += fuelCell
    }
    if (hitsKillerSub(x, y)) {
        userSubExists = false
    }
    else {
        grid[y][x] = "U"
        table.rows[y].cells[x].className = "BlueCell"
        table.rows[y].cells[x].innerHTML = "U"
    }
}

/**
* Attempts to moves the users submarine
* @param direction direction entered by user to move the submarine
* @return true if the submarine can move in the specified direction, false otherwise
*/
function attemptMoveUserSub(direction) {
    switch (direction) {
        // Move up
        case "W":
            if (outsideGrid(subX, subY - 1)) {
                alert("Cannot move the submarine outside the grid!")

            }
            else if (hitsObstacle(subX, subY - 1)) {
                alert("Cannot move the submarine, an obstacle is in the way!")

            }
            else {
                moveUserSub(subX, subY - 1)
                subY--
                return true
            }
            break;
        case "A":
            // Move left
            if (outsideGrid(subX - 1, subY)) {
                alert("Cannot move the submarine outside the grid!")
            }
            else if (hitsObstacle(subX - 1, subY)) {
                alert("Cannot move the submarine, an obstacle is in the way!")

            }
            else {
                moveUserSub(subX - 1, subY)
                subX--
                return true

            }
            break;
        case "D":
            // Move right
            if (outsideGrid(subX + 1, subY)) {
                alert("Cannot move the submarine outside the grid!")

            }
            else if (hitsObstacle(subX + 1, subY)) {
                alert("Cannot move the submarine, an obstacle is in the way!")

            }
            else {
                moveUserSub(subX + 1, subY)
                subX++
                return true

            }
            break;
        case "X":
            // Move down
            if (outsideGrid(subX, subY + 1)) {
                alert("Cannot move the submarine outside the grid!")

            }
            else if (hitsObstacle(subX, subY + 1)) {
                alert("Cannot move the submarine, an obstacle is in the way!")

            }
            else {
                moveUserSub(subX, subY + 1)
                subY++
                return true
            }
            break;

    }
    if (totalKillers == 0 || totalFuels == 0 || !userSubExists) {
        endGame()
    }
    return false
}

/**
* Attempts to moves the killer submarine to a cell containing the user's submarine
* if it's within its reach (above, below, left, right, top-left, top-right, bottom-left, bottom-right)
* @param x X co-ordinate of killer submarine
* @param y Y co-ordinate of killer submarine
*/
function moveNearUserSub(x, y, killerSubPosition) {
    // Loop through every direction a killer sub can move and see if that leads it to the users submarine
    for (let i = 0; i < directions.length; i++) {
        var direction = directions[i]
        var newX = x + direction[0]
        var newY = y + direction[1]
        if (!outsideGrid(newX, newY) && !hitsObstacle(newX, newY) && hitsUserSub(newX, newY)) {
            moveKillerSub(newX, newY, killerSubPosition)
            return true
        }
    }

    return false
}

/**
* Attempts to moves the killer submarine to a cell containing fuel
* if it's within its reach (above, below, left, right, top-left, top-right, bottom-left, bottom-right)
* @param x X co-ordinate of killer submarine
* @param y Y co-ordinate of killer submarine
*/
function moveNearFuel(x, y, killerSubPosition) {
    // Loop through every direction a killer sub can move and see if that leads it to a fuel cell
    for (let i = 0; i < directions.length; i++) {
        var direction = directions[i]
        var newX = x + direction[0]
        var newY = y + direction[1]
        if (!outsideGrid(newX, newY) && !hitsObstacle(newX, newY) && hitsFuelCell(newX, newY)) {
            moveKillerSub(newX, newY, killerSubPosition)
            return true
        }
    }
    return false
}

/**
* Checks if a killer submarine is trapped - surrounded by cells it cannot move into
* @param x X co-ordinate of killer submarine
* @param y Y co-ordinate of killer submarine
*/
function trapped(x, y) {
    var freeCells = 0
    // Loop through every direction a killer sub can move and see if it can move into that cell
    for (let i = 0; i < directions.length; i++) {
        var direction = directions[i]
        var newX = x + direction[0]
        var newY = y + direction[1]
        if (outsideGrid(newX, newY) || (!outsideGrid(newX, newY) && hitsObstacle(newX, newY)) || hitsKillerSub(newX, newY)) {
            freeCells++
        }
    }
    console.log(freeCells)
    if (freeCells == 8) {
        console.log("trapped")
        return true
    }
    else {
        return false
    }
}

/**
* Moves the kiler submarine to the specified co-ordinates
* @param x X co-ordinate of the cell to move to
* @param y Y co-ordinate of the cell to move to
* @param i index of the killer submarine position in the killer submarines array
*/
function moveKillerSub(x, y, i) {
    // Get position of the killer sub
    var killerSub = killerSubs[i]
    // Remove the killer sub from the grid and table
    clearSub(killerSub[0], killerSub[1])

    if (hitsFuelCell(x, y)) {
        totalFuels--
        var fuelCell = parseInt(grid[y][x])
        computerScore += fuelCell
    }
    if (hitsUserSub(x, y)) {
        userSubExists = false
        clearSub(subX, subY)
    }
    grid[y][x] = "K"
    table.rows[y].cells[x].className = "RedCell"
    table.rows[y].cells[x].innerHTML = "K"
    // Update position of the killer sub
    killerSubs[i][0] = x
    killerSubs[i][1] = y
}

/**
* Attempts to moves the kiler submarine
* @param i index of the killer submarine to move in the killer submarine position array
*/
function attemptMoveKillSub(i) {
    var killerSub = killerSubs[i]
    // Retrive co-ordinates of the killer submarine
    var x = killerSub[0]
    var y = killerSub[1]
    // Try to move to a cell containing the user's submarine
    if (moveNearUserSub(x, y, i)) {
    }
    // Try to move to a cell containing fuel
    else if (moveNearFuel(x, y, i)) {
    }
    // Move to an arbitrary cell if the killer submarine isn't trapped
    else if (!trapped(x, y) && userSubExists) {
        // Keep generating a direction until the killer sub can move to an unoccuppied cell
        do {
            // Get a random index
            var index = Math.round(Math.random() * 7)
            console.log(index)
            var randDirection = directions[index]
            // Co-ordinates of cell to move killer sub into
            var newX = x + randDirection[0]
            var newY = y + randDirection[1]
            // Check if the cell is empty
            if (!outsideGrid(newX, newY) && !hitsObstacle(newX, newY) && !hitsKillerSub(newX, newY)) {
                moveKillerSub(newX, newY, i)
                break
            }
        } while (outsideGrid(newX, newY) || hitsObstacle(newX, newY) || hitsKillerSub(newX, newY))
    }
    if (totalKillers == 0 || totalFuels == 0 || !userSubExists) {
        endGame()
    }
    showMessage("results", "Round: " + round + "<br> Submarine fuel: " + subFuel + "<br> User score: " + playerScore + "<br> Computer score: " + computerScore, "BlackFont")

}

// Play stage of the game
function play() {
    // First check if the users submarine has enough fuel
    if (subFuel != 0) {
        // Keep prompting the user for input until they supply a valid direction key to move the users submarine
        do {
            var direction = prompt("Enter a direction (W,A,D,X) to move your submarine")
            // If cancel button clicked on the prompt -> break out of loop
            if (direction === null) {
                break
            }
            // Validate the input from the prompt
            else if (!validPlayInput.includes(direction) || direction === "" || direction.length != 1) {
                alert("Please enter a valid direction: W,A,D,X")
            }
            else {
                direction = direction.toUpperCase()
                //Move the submarine
                if (attemptMoveUserSub(direction)) {
                    round++
                    //Move the killer subs
                    for (let i = 0; i < killerSubs.length; i++) {
                        attemptMoveKillSub(i)
                    }
                }
            }
        } while (!validPlayInput.includes(direction) || direction === "" || direction.length != 1)
    }
    else {
        alert("Cannot move the submarine as it is out of fuel!")
        round++
        //Move the killer subs
        for (let i = 0; i < killerSubs.length; i++) {
            attemptMoveKillSub(i)
        }
    }
}



/**
* Event listener function for when the user clicks on a cell on the table
* @param x X co-ordinate of the clicked cell
* @param y Y co-ordinate of the clicked cell
* @param event event triggered by clicking the cell

*/
function clickCell(x, y, event) {
    // Ensures the cells are only clickable when the game is in the setup stage
    switch (gameStage) {
        case "setup":
            setUpGrid(x, y, event)
            break;
        case "play":
            break;
        case "end":
            break;
    }
}

/**
* Initialize the HTML table
* @param x X co-ordinate of the clicked cell
* @param y Y co-ordinate of the clicked cell
* @param event event triggered by clicking the cell

*/
function initTable(table) {
    for (y = 0; y < grid.length; y++) {
        var tr = document.createElement("tr")
        table.appendChild(tr)
        for (x = 0; x < grid[y].length; x++) {
            var td = document.createElement("td")
            var txt = document.createTextNode(" ")
            td.appendChild(txt)
            td.addEventListener("click", clickCell.bind(null, x, y), false)

            tr.appendChild(td)
        }
    }
}
initTable(table)
moveButton.style.visibility = "hidden";
endButton.style.visibility = "hidden";
restartBtn.style.visibility = "hidden"