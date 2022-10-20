import { useEffect, useState } from "react";
import { DragHandleIcon } from "@chakra-ui/icons";
import {
  Icon,
  VStack,
  Stack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Input,
} from "@chakra-ui/react";
import { BlockType, BlockTypeEnum } from "../types";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DropdownItem } from "./DropdownItem";
import { ItemMapper } from "./ItemMapper";
import { deleteById, updateItem, addItem } from "../utils";

export const ItemGroup = ({
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [titleItem, setTitleItem] = useState("");
  const [nameItem, setNameItem] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [titleAddItem, setTitleAddItem] = useState("");
  const [nameAddItem, setNameAddItem] = useState("");
  const [typeAddItem, setTypeAddItem] = useState(BlockTypeEnum.GROUP);

  useEffect(() => {
    if (selectedGroup) {
      setTitleItem(selectedGroup?.title);
      setNameItem(selectedGroup?.name);
    }
  }, [selectedGroup]);

  const typeId = blockNum;
  const droppableId = `droppable-${typeId}`;
  const onCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const onOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };
  const onOpenEditModal = () => setIsEditModalOpen(true);
  const onCloseEditModal = () => setIsEditModalOpen(false);

  const onDeleteItem = () => {
    const itemBlockNum = `${typeId}--${selectedGroup.id}`;
    if (allBlocks) {
      const arr = deleteById(itemBlockNum, allBlocks);
      setBlocks([...arr]);
    }
    setIsDeleteModalOpen(false);
  };

  const onEditItem = () => {
    const itemBlockNum = `${typeId}--${selectedGroup.id}`;
    if (allBlocks) {
      const arr = updateItem(itemBlockNum, allBlocks, {
        title: titleItem,
        name: nameItem,
      });
      setBlocks([...arr]);
    }
    setIsEditModalOpen(false);
  };

  const onOpenAddModal = () => setIsAddModalOpen(true);
  const onCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNameAddItem("");
    setTitleAddItem("");
    setTypeAddItem(BlockTypeEnum.GROUP);
  };

  const onAddItem = () => {
    const itemBlockNum = `${typeId}--${selectedGroup.id}`;
    if (allBlocks) {
      const arr = addItem(itemBlockNum, allBlocks, {
        title: titleAddItem,
        name: nameAddItem,
        type: typeAddItem,
      });
      setBlocks([...arr]);
    }
    setIsDeleteModalOpen(false);
    setNameAddItem("");
    setTitleAddItem("");
    setTypeAddItem(BlockTypeEnum.GROUP);
    setIsAddModalOpen(false);
  };

  if (block.type !== BlockTypeEnum.GROUP) {
    return null;
  }
  return (
    <>
      <Droppable droppableId={droppableId} type={`${typeId}`}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}>
            <VStack
              alignItems="start"
              display="block"
              borderRadius="md"
              padding={4}
              spacing={4}
              backgroundColor={
                snapshot.isDraggingOver ? "gray.200" : "gray.100"
              }
              marginTop="16px"
            >
              {block.contentList.map((innerBlock, index) => (
                <Draggable
                  key={`${typeId}--${innerBlock.id}`}
                  draggableId={`${typeId}--${innerBlock.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <DropdownItem
                        block={innerBlock}
                        isDragging={snapshot.isDragging}
                        icon={
                          <span {...provided.dragHandleProps}>
                            <Icon
                              as={DragHandleIcon}
                              boxSize="3"
                              color="gray.600"
                            />
                          </span>
                        }
                      >
                        <ItemMapper
                          block={innerBlock}
                          blockNum={`${typeId}--${innerBlock.id}`}
                          setBlocks={setBlocks}
                          allBlocks={allBlocks}
                        />
                        <Stack direction="row" spacing={4}>
                          {innerBlock?.type === BlockTypeEnum.GROUP && (
                            <Button
                              colorScheme="blue"
                              size="xs"
                              onClick={() => {
                                onOpenAddModal();
                                setSelectedGroup(innerBlock);
                              }}
                            >
                              Add
                            </Button>
                          )}
                          <Button
                            size="xs"
                            onClick={() => {
                              onOpenEditModal();
                              setSelectedGroup(innerBlock);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="xs"
                            onClick={() => {
                              onOpenDeleteModal();
                              setSelectedGroup(innerBlock);
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </DropdownItem>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </VStack>
          </div>
        )}
      </Droppable>
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure to delete this item</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseDeleteModal}>
              Close
            </Button>
            <Button variant="ghost" colorScheme="red" onClick={onDeleteItem}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={onCloseEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={titleItem}
                onChange={(e) => setTitleItem(e.target.value)}
              />
              {/* {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )} */}
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={nameItem}
                onChange={(e) => setNameItem(e.target.value)}
              />
              {/* {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )} */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseEditModal}>
              Close
            </Button>
            <Button variant="ghost" onClick={onEditItem}>
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isAddModalOpen} onClose={onCloseAddModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={titleAddItem}
                onChange={(e) => setTitleAddItem(e.target.value)}
              />
              {/* {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )} */}
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={nameAddItem}
                onChange={(e) => setNameAddItem(e.target.value)}
              />
              {/* {!isError ? (
                <FormHelperText>
                  Enter the email you'd like to receive the newsletter on.
                </FormHelperText>
              ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
              )} */}
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Select Type"
                defaultValue="Group"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Group") {
                    setTypeAddItem(BlockTypeEnum.GROUP);
                  } else if (val === "Text") {
                    setTypeAddItem(BlockTypeEnum.TEXT);
                  }
                }}
              >
                <option>Group</option>
                <option>Text</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseAddModal}>
              Close
            </Button>
            <Button variant="ghost" onClick={onAddItem}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
