import { Request, Response } from "express";
import Interest from "../models/interest";
const getArticles = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const limt = 10;
    const skip = (Number(page) - 1) * limt;
    const interests = await Interest.aggregate([
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limt,
            },
          ],
        },
      },
    ]);
    res.status(201).send({ success: true, interests: interests[0].data });
  } catch (err) {
    console.log(err);
  }
};
const addInterest = async (req: Request, res: Response) => {
  try {
    const { title, subInterests } = req.body.title;
    if (!title)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء توفير عنوان" });
    await Interest.create({
      title,
      subInterests,
      createdAt: new Date(),
    });
    res.status(201).send({ success: true, message: "تم انشاء الاهتمام" });
  } catch (err) {
    console.log(err);
  }
};
const editInterest = async (req: Request, res: Response) => {
  try {
    const interestId = req.body.interestId;
    const {
      title,
      subInterest,
    }: { index: string; title: string; subInterest: [] } = req.body;
    if (!title || !Array.isArray(subInterest))
      return res
        .status(401)
        .send({ success: false, message: "الرجاء تفقد البيانات المعطاة" });

    const interest = await Interest.findOne({ _id: interestId });
    let updateQuery:{$set:{title:string, subInterest:[]}};
    if (title !== interest.title) updateQuery.$set.title = title;
    if (String(subInterest) !== String(interest.subInterests)) updateQuery.$set.title = title;
    //
  } catch (err) {
    console.log(err);
  }
};
const deleteInterest = async (req: Request, res: Response) => {
  try {
    const interestId = req.body.interestId;
    if (!interestId)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء توفير id" });
    const deleteStatus = await Interest.deleteOne({ _id: interestId });
    res.send({ success: true, message: "تم حذف التعليق" });
  } catch (err) {
    console.log(err);
  }
};
export { getArticles, addInterest, deleteInterest };
