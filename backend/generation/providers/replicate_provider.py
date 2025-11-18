import os
from typing import Optional
import replicate
from .base import BaseProvider


class ReplicateProvider(BaseProvider):
    """
    Replicate API provider for virtual try-on using IDM-VTON model.

    IDM-VTON (Improving Diffusion Models for Virtual Try-On) is a state-of-the-art
    virtual try-on model that produces high-quality results.

    Model: cuuupid/idm-vton
    Docs: https://replicate.com/cuuupid/idm-vton
    """

    def __init__(self):
        """Initialize Replicate provider with API credentials."""
        self.api_token = os.getenv('REPLICATE_API_TOKEN')
        if not self.api_token:
            raise ValueError("REPLICATE_API_TOKEN not found in environment")

        # Set API token in environment for replicate library
        os.environ['REPLICATE_API_TOKEN'] = self.api_token

        # IDM-VTON model identifier
        # Using the latest version of the model
        self.model_id = "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4"

        # Quality preset mapping to model parameters
        self.quality_presets = {
            'draft': {
                'n_samples': 1,
                'n_steps': 20,
                'image_scale': 1.0,
            },
            'standard': {
                'n_samples': 1,
                'n_steps': 30,
                'image_scale': 1.0,
            },
            'high': {
                'n_samples': 1,
                'n_steps': 50,
                'image_scale': 2.0,
            }
        }

    @property
    def name(self) -> str:
        """Return provider name."""
        return "Replicate (IDM-VTON)"

    def generate(
        self,
        model_image_url: str,
        garment_image_url: str,
        quality_preset: str,
        category: str = 'upper_body',
        garment_description: str = ''
    ) -> str:
        """
        Submit generation to Replicate API using IDM-VTON model.

        The IDM-VTON model produces synchronous results, so the generation
        completes during this call.

        Args:
            model_image_url: URL to the person/model image
            garment_image_url: URL to the garment/clothing image
            quality_preset: Quality setting ('draft', 'standard', 'high')
            category: Garment category ('upper_body', 'lower_body', 'dresses')
            garment_description: Optional description of the garment

        Returns:
            str: Result URL (for IDM-VTON, this is returned immediately)

        Raises:
            Exception: If generation fails
        """
        try:
            # Validate quality preset
            if not self.validate_quality_preset(quality_preset):
                raise ValueError(f"Invalid quality preset: {quality_preset}")

            # Validate category
            valid_categories = ['upper_body', 'lower_body', 'dresses']
            if category not in valid_categories:
                raise ValueError(f"Invalid category: {category}. Must be one of {valid_categories}")

            # Get quality parameters
            params = self.quality_presets.get(
                quality_preset,
                self.quality_presets['standard']
            )

            # Use provided description or default
            garment_desc = garment_description if garment_description else "Product photo"

            # Handle image inputs - support both URLs and file paths
            # If URLs start with http://localhost, convert to file paths
            model_img_input = model_image_url
            garment_img_input = garment_image_url

            # Check if we have local file paths (starting with /media/ or absolute paths)
            # If so, open as file handles for direct upload
            model_file_handle = None
            garment_file_handle = None

            try:
                # Try to open as local files if they're file paths
                if not model_image_url.startswith('http://') and not model_image_url.startswith('https://'):
                    model_file_handle = open(model_image_url, 'rb')
                    model_img_input = model_file_handle
                elif model_image_url.startswith('http://localhost'):
                    # Convert localhost URL to file path
                    # Extract path after /media/
                    import re
                    from django.conf import settings
                    path_match = re.search(r'/media/(.+)$', model_image_url)
                    if path_match:
                        file_path = settings.MEDIA_ROOT + '/' + path_match.group(1)
                        model_file_handle = open(file_path, 'rb')
                        model_img_input = model_file_handle

                if not garment_image_url.startswith('http://') and not garment_image_url.startswith('https://'):
                    garment_file_handle = open(garment_image_url, 'rb')
                    garment_img_input = garment_file_handle
                elif garment_image_url.startswith('http://localhost'):
                    # Convert localhost URL to file path
                    import re
                    from django.conf import settings
                    path_match = re.search(r'/media/(.+)$', garment_image_url)
                    if path_match:
                        file_path = settings.MEDIA_ROOT + '/' + path_match.group(1)
                        garment_file_handle = open(file_path, 'rb')
                        garment_img_input = garment_file_handle

                # Prepare input for IDM-VTON model
                input_data = {
                    "human_img": model_img_input,
                    "garm_img": garment_img_input,
                    "garment_des": garment_desc,
                    "category": category,
                    "n_samples": params['n_samples'],
                    "n_steps": params['n_steps'],
                    "image_scale": params['image_scale'],
                    "seed": -1,  # Random seed for variation
                }

                # Run prediction
                # Note: IDM-VTON typically returns results synchronously
                output = replicate.run(
                    self.model_id,
                    input=input_data
                )

            finally:
                # Clean up file handles
                if model_file_handle:
                    model_file_handle.close()
                if garment_file_handle:
                    garment_file_handle.close()

            # Handle output
            # IDM-VTON returns a list of URLs or a single URL
            if isinstance(output, list):
                if len(output) > 0:
                    result_url = str(output[0])
                else:
                    raise Exception("No output generated from Replicate")
            else:
                result_url = str(output)

            # Return the result URL as the job_id
            # (since this is synchronous, the "job" is already complete)
            return result_url

        except Exception as e:
            raise Exception(f"Replicate generation failed: {str(e)}")

    def get_status(self, job_id: str) -> str:
        """
        Check generation status.

        For Replicate IDM-VTON, generation is synchronous, so if we have
        a job_id (which is actually the result URL), it's already completed.

        Args:
            job_id: Result URL from generate()

        Returns:
            str: Status - 'completed' if job_id exists, 'failed' otherwise
        """
        if job_id and job_id.startswith('http'):
            return 'completed'
        return 'failed'

    def get_result(self, job_id: str) -> Optional[str]:
        """
        Get result image URL.

        For Replicate IDM-VTON, the job_id IS the result URL.

        Args:
            job_id: Result URL from generate()

        Returns:
            Optional[str]: The result image URL
        """
        if job_id and job_id.startswith('http'):
            return job_id
        return None

    def get_model_info(self) -> dict:
        """
        Get information about the IDM-VTON model.

        Returns:
            dict: Model information including version, capabilities, etc.
        """
        return {
            'name': 'IDM-VTON',
            'version': 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4',
            'provider': 'Replicate',
            'description': 'Improving Diffusion Models for Virtual Try-On',
            'synchronous': True,
            'avg_processing_time': '15-20 seconds',
            'cost_per_generation': '$0.025',
            'supported_categories': ['upper_body', 'lower_body', 'dresses', 'auto'],
        }
