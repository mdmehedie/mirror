from abc import ABC, abstractmethod
from typing import Optional


class BaseProvider(ABC):
    """
    Abstract base class for AI virtual try-on providers.

    All providers must implement these methods to ensure consistent
    behavior across different AI services.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """
        Provider display name.

        Returns:
            str: Human-readable provider name (e.g., "Gemini", "Replicate")
        """
        pass

    @abstractmethod
    def generate(
        self,
        model_image_url: str,
        garment_image_url: str,
        quality_preset: str,
        category: str = 'upper_body',
        garment_description: str = ''
    ) -> str:
        """
        Submit a virtual try-on generation request.

        Args:
            model_image_url: URL to the model/person image
            garment_image_url: URL to the garment/clothing image
            quality_preset: Quality setting ('draft', 'standard', 'high')
            category: Garment category ('upper_body', 'lower_body', 'dresses')
            garment_description: Optional description of the garment

        Returns:
            str: Job ID or result identifier for tracking the generation

        Raises:
            Exception: If the generation request fails
        """
        pass

    @abstractmethod
    def get_status(self, job_id: str) -> str:
        """
        Check the status of a generation job.

        Args:
            job_id: The job identifier returned from generate()

        Returns:
            str: Status code - one of:
                - 'pending': Job is queued
                - 'processing': Job is actively processing
                - 'completed': Job finished successfully
                - 'failed': Job failed
        """
        pass

    @abstractmethod
    def get_result(self, job_id: str) -> Optional[str]:
        """
        Get the result image URL for a completed generation.

        Args:
            job_id: The job identifier returned from generate()

        Returns:
            Optional[str]: URL to the result image, or None if not available
        """
        pass

    def validate_quality_preset(self, quality_preset: str) -> bool:
        """
        Validate quality preset value.

        Args:
            quality_preset: Quality setting to validate

        Returns:
            bool: True if valid, False otherwise
        """
        valid_presets = ['draft', 'standard', 'high']
        return quality_preset in valid_presets
