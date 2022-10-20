import { BlockType, BlockTypeEnum } from "./types";
import { useRef, useState } from "react";

export interface UseBooleanActions {
  set: (val: boolean) => void;
  toggle: () => void;
  true: () => void;
  false: () => void;
}

export const useBoolean = (initial = false): [boolean, UseBooleanActions] => {
  const [value, setValue] = useState<boolean>(initial);

  const updateValue = useRef({
    set: (val: boolean) => setValue(Boolean(val)),
    toggle: () => setValue((val) => !val),
    true: () => setValue(true),
    false: () => setValue(false),
  });

  return [value, updateValue.current];
};

export const Reorder = (
  list: BlockType[] = [],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getLastestId = (value: string): string => {
  const array = value.split("--");
  return array[array.length - 1];
};

export const updateBlockById = (
  id: string,
  obj: BlockType,
  block: BlockType
): BlockType => {
  const arr = [];
  arr.push(block);

  const updatedeBlocks = arr.map((k) =>
    k.id === id
      ? { ...k, ...obj }
      : { ...k, contentList: k.contentList ? updateBlockById(id, obj, k) : [] }
  );
  return updatedeBlocks[0] as BlockType;
};

export function findById(
  id: string,
  array: BlockType[]
): BlockType | undefined {
  let object;

  array.some(function f(a) {
    if (a.id === id) {
      object = a;
      return true;
    }
    if (Array.isArray(a?.contentList)) {
      return a?.contentList.some(f);
    }

    return undefined;
  });
  return object;
}

export function deleteById(
  blockNum: string | number,
  array: BlockType[]
): BlockType[] {
  let testArr: any = array;
  if (typeof blockNum === "string") {
    blockNum.split("--").map((item, index, _arr) => {
      for (let i = 0; i < testArr.length; i++) {
        if (testArr[i]?.id === item) {
          if (index === _arr.length - 1) {
            testArr[i]?.contentList?.splice(i, 1);
            console.log(testArr[i]);

            testArr.splice(i, 1);
          } else {
            testArr = testArr[i].contentList;
          }
        }
      }
    });
  }
  return array;
}

export function updateItem(
  blockNum: string | number,
  array: BlockType[],
  updation: any
): BlockType[] {
  let testArr: any = array;
  if (typeof blockNum === "string") {
    blockNum.split("--").map((item, index, _arr) => {
      for (let i = 0; i < testArr.length; i++) {
        if (testArr[i]?.id === item) {
          if (index === _arr.length - 1) {
            // testArr[i]?.contentList?.splice(i, 1)

            // testArr.splice(i, 1)
            testArr[i] = {
              ...testArr[i],
              ...updation,
            };
          } else {
            testArr = testArr[i].contentList;
          }
        }
      }
    });
  }
  return array;
}

const makeid = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function addItem(
  blockNum: string | number,
  array: BlockType[],
  updation: any
): BlockType[] {
  let testArr: any = array;
  if (typeof blockNum === "string") {
    blockNum.split("--").map((item, index, _arr) => {
      for (let i = 0; i < testArr.length; i++) {
        if (testArr[i]?.id === item) {
          if (index === _arr.length - 1) {
            // testArr[i]?.contentList?.splice(i, 1)

            // testArr.splice(i, 1)
            const id = makeid(8);
            if (updation.type === BlockTypeEnum.GROUP) {
              testArr[i]?.contentList.push({
                ...updation,
                id,
                contentList: [],
              });
            } else if (updation.type === BlockTypeEnum.TEXT) {
              testArr[i]?.contentList.push({
                ...updation,
                id,
                value: "",
                required: false,
                attributes: [],
              });
            }
          } else {
            testArr = testArr[i].contentList;
          }
        }
      }
    });
  }
  return array;
}
