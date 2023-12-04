import { Request, Response } from "express";
import Topic from "./model";
import Article from "../article/model";
import topicSchema from "../validation/topic";
const getTopics = async (req: Request, res: Response) => {
  try {
    const page = req.query.page || 1;
    const limt = 10;
    const skip = (Number(page) - 1) * limt;
    const topics = await Topic.aggregate([
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
    res.status(201).send({ success: true, topics: topics[0].data });
  } catch (err) {
    console.log(err.code);
  }
};
const addTopic = async (req: Request, res: Response) => {
  try {
    const { title, subTopics } = req.body;
    await topicSchema.addTopic.validateAsync({ title, subTopics });
    await Topic.create({
      title,
      subTopics,
    });
    res.status(201).send({ success: true, message: "تم الاضافة" });
  } catch (err) {
    switch (true) {
      case err.isJoi:
        const { message, context } = err.details[0];
        return res.status(401).send({ success: false, message, context });
      case err.code === 11000:
        console.log(err);

        return res
          .status(401)
          .send({ success: false, message: "يوجد موضوع بهذا العنوان مسبقا" });
      default:
        console.log(err);
    }
  }
};
const addMultipleTopic = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data))
      return res
        .status(401)
        .send({ success: false, message: "لم يتم اعطاء البيانات" });
    await Topic.insertMany(data, { ordered: false });
    res.status(201).send({ success: false, message: "تم اضافة المواضيع" });
  } catch (err) {
    console.log(err);
  }
};
const editTopic = async (req: Request, res: Response) => {
  try {
    const topicId = req.params.id
    const {
      title,
      subTopics,
    } =
      req.body;
    if (!title && !Array.isArray(subTopics))
      return res
        .status(401)
        .send({ success: false, message: "الرجاء تفقد البيانات المعطاة" });

    const topic = await Topic.findOne({ _id: topicId });
    if (!topic)
      return res
        .status(401)
        .send({ success: false, message: "لا يوجد موضوع بهذا المعرف" });
    const updateQuery = { $set: {} };
    if (title && title !== topic.title)
      updateQuery.$set = { ...updateQuery.$set, title };
    if (subTopics && String(subTopics) !== String(topic.subTopics))
      updateQuery.$set = { ...updateQuery.$set, subTopics };
    if (JSON.stringify(updateQuery) === "{$set:{}}")
      return res
        .status(401)
        .send({ success: false, message: "لم يتم احداث اي تغير" });
    const updateStatus = await Topic.updateOne({ _id: topicId }, updateQuery);
    if (updateStatus.matchedCount !== 1)
      return res
        .status(401)
        .send({ success: false, message: "لم يتم العثور على الموضوع" });
    res.status(201).send({ success: true, message: "تم اجراء التغيرات" });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      const field = Object.entries(err.keyValue).flat();
      if (field[0] === "title") {
        res.status(401).send({
          success: false,
          message: `يوجد موضوع بهذا العنوان مسبقا (${field[1]})`,
        });
      } else {
        res.status(401).send({
          success: false,
          message: `يوجد موضوع فرعي بهذا العنوان مسبقا (${field[1]})`,
        });
      }
    }
  }
};
const deleteTopic = async (req: Request, res: Response) => {
  try {
    const topicId = req.params.id
    if (!topicId)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء توفير معرف الموضوع" });
    const topic = await Topic.findOne({ _id: topicId });
    if (!topic)
      return res
        .status(401)
        .send({ success: false, message: "لا يوجد موضوع بهذا المعرف" });
    const subTopics = topic.subTopics.map((t) => t._id);
    await Article.updateMany(
      {
        "topics": topicId,
      },
      {
        $pull: {
          topics: { $in: [topicId, ...subTopics] },
        },
      }
    );
    await Topic.deleteOne({ _id: topicId });
    res.send({ success: true, message: "تم حذف الموضوع" });
  } catch (err) {
    console.log(err);
  }
};
const deleteSubTopic = async (req: Request, res: Response) => {
  try {
    const topicId = req.params.id
    if (!topicId)
      return res
        .status(401)
        .send({ success: false, message: "الرجاء توفير معرف الموضوع الفرعي" });
    const deleteSubTopicStatus = await Topic.updateOne(
      {
        "subTopics": topicId,
      },
      {
        $pull: {
          subTopics: topicId,
        },
      }
    );
    if (deleteSubTopicStatus.modifiedCount === 0)
      return res
        .status(401)
        .send({ success: false, message: "لا يوجد موضوع فرعي بهذا المعرف" });
    await Article.updateMany(
      {
        "topics._id": topicId,
      },
      {
        $pull: {
          topics: {
            _id: topicId,
          },
        },
      }
    );
    res.send({ success: true, message: "تم حذف الموضوع الفرعي" });
  } catch (err) {
    console.log(err);
  }
};
export {
  getTopics,
  addTopic,
  addMultipleTopic,
  editTopic,
  deleteTopic,
  deleteSubTopic,
};  
