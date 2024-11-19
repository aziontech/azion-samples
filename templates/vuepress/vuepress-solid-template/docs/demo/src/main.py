import logging

import torch

print("PyTorch:", torch.__version__)

device = None
if torch.cuda.is_available():
    device = torch.device("cuda")
    logging.log("CUDA:", torch.version.cuda)
    logging.log("cuDNN:", torch.backends.cudnn.version())
else:
    device = torch.device("cpu")
    logging.warn(
        "CUDA is not available, using CPU instead! Check your CUDA installation!"
    )
