const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
    try {
      const employees = await prisma.employee.findMany();
      res.json(employees);
    } catch (e) {
      next(e);
    }
  });


router.get("/:id", async (req, res, next) => {
    let { id } = req.params;
    
  
    try {
        if (id === "random") {
            const employees = await prisma.employee.findMany()
            const limit = employees.length
            id = Math.round(Math.random() * limit) 
        }
      // `id` has to be converted into a number before looking for it!
      const employee = await prisma.employee.findUnique({ where: { id: +id } });
      if (employee) {
        res.json(employee);
      } else {
        next({ status: 404, message: `Employee with id ${id} does not exist.` });
      }
    } catch (e) {
      next(e);
    }
  });

  router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
  
    // Check if title was provided
    if (!name) {
      return next({
        status: 400,
        message: "A new name must be provided.",
      });
    }
  
    try {
      // Check if the book exists
      const employee = await prisma.employee.findUnique({ where: { id: +id } });
      if (!employee) {
        return next({
          status: 404,
          message: `Employee with id ${id} does not exist.`,
        });
      }
  
      // Update the book
      const updatedEmployee = await prisma.employee.update({
        where: { id: +id },
        data: { name },
      });
      res.json(updatedEmployee);
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return next({
        status: 400,
        message: "Name must be provided for a new employee.",
      });
    }
    try {
      const employee = await prisma.employee.create({ data: { name } });
      res.status(201).json(employee);
    } catch (e) {
      next(e);
    }
  });

  router.post("/", async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
      return next({
        status: 400,
        message: "Name must be provided for a new employee.",
      });
    }
    try {
      const employee = await prisma.employee.create({ data: { name } });
      res.status(201).json(employee);
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
  
    try {
      // Check if the book exists
      const employee = await prisma.employee.findUnique({ where: { id: +id } });
      if (!employee) {
        return next({
          status: 404,
          message: `Employee with id ${id} does not exist.`,
        });
      }
  
      // Delete the book
      await prisma.employee.delete({ where: { id: +id } });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  });

  