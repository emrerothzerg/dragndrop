import { useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { BlockType, BlockTypeEnum } from "../types";
import { ItemGroup } from "./ItemGroup";

export const ItemMapper = ({
  block,
  blockNum,
  setBlocks,
  allBlocks,
}: {
  block: BlockType;
  blockNum: string | number;
  setBlocks?: any;
  allBlocks?: BlockType[];
}) => {
  const getRenderItem = useCallback(() => {
    if (block.type === BlockTypeEnum.TEXT) {
      return (
        <Box>
          <div>Value = {block.title}</div>
        </Box>
      );
    } else if (block.type === BlockTypeEnum.GROUP) {
      return (
        <ItemGroup
          block={block}
          blockNum={blockNum}
          setBlocks={setBlocks}
          allBlocks={allBlocks}
        />
      );
    }
    return null;
  }, [block]);

  return <>{getRenderItem()}</>;
};
