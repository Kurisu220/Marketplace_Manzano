import express from "express"
import mysql from "mysql"
import cors from 'cors'
import multer from "multer"
import bcrypt from 'bcrypt';

//CONNECTING TO MYSQL
const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "manz1234",
    database: "marketplace"
})

const app = express()
app.use(express.json())
app.use(cors())

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// CONFIRMATION TO BACKEND
app.get("/", (req, res)=>{
    res.json("this is the backend") 
 })
 
// VIEW THE STORE
app.get("/store", (req, res)=>{
    const q = "SELECT * FROM store"
    db.query(q,(err, data)=> {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// ADDING NEW ITEM
app.post("/store", upload.single("image"), (req, res) => {
    const q =
        "INSERT INTO store (`prod_name`, `prod_description`,`category`, `image`, `price`, `quantity`) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        req.body.prod_name,
        req.body.prod_description,
        req.body.category,
        req.file.buffer,
        req.body.price,
        req.body.quantity,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("successfully executed");
    });
});

// DELETING ITEM
app.delete("/store/:id", (req, res)=>{
    const storeID= req.params.id;
    const q= "DELETE FROM store WHERE id= ?"

    db.query(q, [storeID], (err, data) => {
        if (err) return res.json(err);
        return res.json("successfully deleted");
    })
})

// UPDATE
app.put("/store/:id", upload.single("image"), (req, res) => {
    const storeID = req.params.id;
    const updateFields = [];
    const values = [];

    if (req.body.prod_name !== undefined) {
        updateFields.push("`prod_name`=?");
        values.push(req.body.prod_name);
    }
    if (req.body.prod_description !== undefined) {
        updateFields.push("`prod_description`=?");
        values.push(req.body.prod_description);
    }
    if (req.body.category !== undefined) {
        updateFields.push("`category`=?");
        values.push(req.body.category);
    }
    if (req.file) {
        // Update the image only if a new file is provided
        updateFields.push("`image`=?");
        values.push(Buffer.from(req.file.buffer));
    }
    if (req.body.price !== undefined) {
        updateFields.push("`price`=?");
        values.push(req.body.price);
    }
    if (req.body.quantity !== undefined) {
        updateFields.push("`quantity`=?");
        values.push(req.body.quantity);
    }

    const q = `UPDATE store SET ${updateFields.join(", ")} WHERE id=?`;

    db.query(q, [...values, storeID], (err, data) => {
        if (err) return res.json(err);
        return res.json("Item has been successfully updated");
    });
});


//purchase
app.post("/purchase", async (req, res) => {
    const purchaseItems = req.body.purchaseItems;
  
    // Loop through purchased items and update the quantity in the database
    for (const item of purchaseItems) {
      const updateQuantityQuery = "UPDATE store SET quantity = quantity - ? WHERE id = ?";
      const values = [item.quantity, item.id];
  
      try {
        await db.query(updateQuantityQuery, values);
      } catch (error) {
        console.error("Error updating quantity:", error);
        return res.status(500).json("Error updating quantity");
      }
    }
  
    return res.json("Purchase successful");
  });

// SIGN UP
app.post('/signup', async (req, res) => {
    const checkEmailQuery = "SELECT * FROM user WHERE `email` = ?";
    const insertUserQuery = "INSERT INTO user (`username`, `password`,`email`) VALUES (?, ?, ?)";

    try {
        // Check if the email already exists in the database
        db.query(checkEmailQuery, [req.body.email], async (checkErr, checkData) => {
            if (checkErr) {
                return res.json("Error");
            }

            if (checkData.length > 0) {
                // Email already exists, return an error
                return res.json("Email already taken");
            } else {
                // Email is not taken, proceed with user registration
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const values = [
                    req.body.name,
                    hashedPassword,
                    req.body.email,
                ];

                db.query(insertUserQuery, values, (insertErr, data) => {
                    if (insertErr) {
                        return res.json("Error");
                    }
                    return res.json(data);
                });
            }
        });
    } catch (error) {
        return res.json("Error hashing password");
    }
});


// LOGIN
app.post('/login', async (req, res) => {
    const q = "SELECT * FROM user WHERE `email` = ?";
    db.query(q, [req.body.email], async (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            const storedHashedPassword = data[0].password;
            try {
                // Compare the entered password with the stored hashed password
                const passwordMatch = await bcrypt.compare(req.body.password, storedHashedPassword);
                
                if (passwordMatch) {
                    const username = data[0].username;
                    const userId = data[0].user_id;
                    return res.json({ success: "Success", userId, username });
                } else {
                    return res.json("Failed");
                }
            } catch (error) {
                return res.json("Error comparing passwords");
            }
        } else {
            return res.json("Failed");
        }
    });
});


  app.listen(8800, () => {
    console.log("running backend on port 8800");
});
