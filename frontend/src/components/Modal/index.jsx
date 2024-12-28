import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

const CustomModal = ({
  isOpen,
  onClose,
  size = "md",
  title,
  children,
  onOk,
  okText = "Guardar",
  closeText = "Cerrar",
  confirmLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        {title &&
          <ModalHeader>
            <Text fontSize="2xl">
              {title}
            </Text>
          </ModalHeader>
        }
        <ModalCloseButton />
        <ModalBody fontSize="md">
          {children}
        </ModalBody>

        <ModalFooter>
          {onOk &&
            <Button
              colorScheme='blue'
              onClick={() => {
                onOk();
              }}
              isLoading={confirmLoading}
            >
              {okText}
            </Button>
          }
          <Button
            onClick={onClose}
          >
            {closeText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// Validacion de props
CustomModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any,
  onOk: PropTypes.func,
  okText: PropTypes.string,
  closeText: PropTypes.string,
  confirmLoading: PropTypes.bool,
};

export default CustomModal;